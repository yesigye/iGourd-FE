import { observable, onFieldChange, useRecord } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { omit } from '@igourd/utils';
import { paymentMethodListUsingPOST } from '@@/setting/apis';
import { orderNoGenerate } from '#/api/common';

import {
  getFinanceCategoryOptions,
  getAccountingPeriodsApi,
  getLedgersSelect,
} from '@@/account/apis';

import { useDrawerForm } from '#/hooks';

import schema from './form-schema';
import { useUserStore } from '@igourd/stores';
import { ref } from 'vue';
import { isBetween } from '@igourd/utils';

interface ISelectItem {
  label: string;
  value: string;
}

const accountOptions = observable<{ value: Array<ISelectItem> }>({ value: [] });
const targetOptions = observable<{ value: Array<ISelectItem> }>({ value: [] });
const paymentMethodsOptions = observable<{ value: Array<ISelectItem> }>({
  value: [],
});
const accounting_note_no = observable<{ value: string }>({ value: '' });

export function useNotesForm() {
  const { t } = useI18n();
  const enabledDate = ref<any[]>([]);

  const {
    currentLoginUserApp: { owner_id: merchant_id },
    merchantInfo: { account_set_id, basic_currency_code },
  } = useUserStore();
  /**
   *
   * @param keywords
   * @returns
   */
  function remoteMethod(keywords: string) {
    const type = formAPI.getValuesIn('change_type');
    return getFinanceCategoryOptions({
      type,
      keywords,
      page_size: 20,
      page_num: 1,
    });
  }
  function handleCateSelect(op: any) {
    formAPI.setValues({
      target_account_ledger_code_list: op.target_account_ledger_code,
      account_ledger_code_list: op.account_ledger_codes,
    });
  }

  function tradingDisabledFn(time: Date) {
    const canPick = enabledDate.value.find((i) => {
      return isBetween(time, i.range, 'day');
    });
    return !canPick;
  }

  async function genOrderNumber() {
    if (Reflect.has(drawerApi.getData(), 'id')) {
      return;
    }
    const { order_no } = await orderNoGenerate({
      category_type: 'ACCOUNTING_NOTE',
    });
    accounting_note_no.value = order_no;
  }

  async function getPaymentMethods() {
    paymentMethodsOptions.value = await paymentMethodListUsingPOST({
      is_enabled: false,
      is_filter_balance: true,
    }).then((res) => {
      return res.map((item: any) => {
        return {
          ...item,
          value: item.payment_method_id,
          label: item.payment_method_name,
        };
      });
    });
  }

  /**
   * 获取会计区间
   */
  async function getTranscationId() {
    const data = await getAccountingPeriodsApi({
      account_set_id,
    }).then((res) => {
      return res.filter((i: any) => !i.is_locked);
    });
    if (!Reflect.has(drawerApi.getData(), 'id')) {
      // 设置默认第一个会计期间
      const [{ id, start_date, period }] = data;
      formAPI.setValues({
        accounting_period: period,
        accounting_period_id: id,
        trading_time: start_date,
      });
    }
    enabledDate.value = data.map((i: any) => {
      return {
        period: i.id,
        range: [i.start_date, i.end_date],
      };
    });
  }

  async function getLedgerOptions() {
    const data = formAPI.getValuesIn(
      '{target_account_ledger_code_list,account_ledger_code_list,accounting_period_id}',
    );
    if (Reflect.ownKeys(data).length !== 3) {
      return;
    }
    if (Object.values(data).every(Boolean)) {
      data.account_set_id = account_set_id;
      accountOptions.value = (await getLedgersSelect(
        omit(data, 'target_account_ledger_code_list'),
      )) as unknown as ISelectItem[];

      targetOptions.value = (await getLedgersSelect({
        ...omit(
          data,
          'account_ledger_code_list',
          'target_account_ledger_code_list',
        ),
        account_ledger_code_list: data.target_account_ledger_code_list,
      })) as unknown as ISelectItem[];
    }
  }

  const { Drawer, Form, drawerApi, formAPI } = useDrawerForm({
    drawerOptions: {
      title: t('note.add-note'),
      class: 'w-[760px]',
      contentClass: 'bg-muted px-0',
      appendToMain: true,
      onOpened: () => {
        getTranscationId();
        getPaymentMethods();
        genOrderNumber();
      },
    },
    formOptions: {
      effects(form) {
        onFieldChange('target_account_ledger_code_list', getLedgerOptions);
        onFieldChange('accounting_period_id', getLedgerOptions);
        onFieldChange('trading_time', () => {
          const value = form.getValuesIn('trading_time');
          const selected = enabledDate.value.find((i) => {
            return isBetween(value, i.range, 'day');
          });
          if (selected) {
            form.setValuesIn('accounting_period_id', selected.period);
          }
        });
        onFieldChange('change_type', () => {
          form.setValuesIn('finance_category_id', '');
        });
        onFieldChange(
          'external_account_data.0.target_account_ledger_id',
          () => {
            const val = formAPI.getValuesIn(
              'external_account_data.0.target_account_ledger_id',
            );
            const op = targetOptions.value.find((i) => i.value === val);
            if (!op) return;
            formAPI.setValuesIn(
              'external_account_data.0.target_node_type',
              //@ts-ignore
              op.node_type,
            );
            formAPI.setValuesIn(
              'external_account_data.0.target_account_id',
              //@ts-ignore
              op.account_id,
            );
          },
        );
        onFieldChange('item_create_volist.*.payment_method_id', (f) => {
          const index = f.index;
          const method = formAPI.getValuesIn(
            `item_create_volist.${index}.payment_method_id`,
          );
          const op = paymentMethodsOptions.value.find(
            (i) => i.value === method,
          );
          if (!op) return;
          formAPI.setValuesIn(
            `item_create_volist.${index}.payment_method_mark`,
            //@ts-ignore
            op.payment_method_mark,
          );
          formAPI.setValuesIn(
            `item_create_volist.${index}.payment_method_type`,
            //@ts-ignore
            op.payment_method_type,
          );
        });
        onFieldChange('item_create_volist.*.account_id', (f) => {
          const index = f.index;
          const account_id = formAPI.getValuesIn(
            `item_create_volist.${index}.account_id`,
          );
          const op = accountOptions.value.find((i) => i.value === account_id);
          if (!op) return;
          formAPI.setValuesIn(
            `item_create_volist.${index}.node_type`,
            //@ts-ignore
            op.node_type,
          );
          formAPI.setValuesIn(
            `item_create_volist.${index}.account_ledger_id`,
            //@ts-ignore
            op.account_ledger_id,
          );
        });
      },
      schema,
      initialValues: {
        change_type: 'REVENUE',
        exchange_rate: 1,
        item_create_volist: [{}],
        device_id: '',
        device_code: '',
        external_account_data: [{}],
        channel: 'WEB',
        currency_code: basic_currency_code,
        accounting_note_no: '',
      },
      scope: {
        accounting_note_no,
        account_set_id,
        basic_currency_code,
        merchant_id,
        tradingDisabledFn,
        accountOptions,
        targetOptions,
        paymentMethodsOptions,
        handleCateSelect,
        remoteMethod,
        receivingAccount: [],
        receivingTargetAccount: [],
        payRevenueOption: [],
        payPurchaseOption: [],
      },
    },
  });
  return { Drawer, Form, drawerApi, formAPI };
}
