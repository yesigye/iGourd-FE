export { default as ChartOfAccountsDrawer } from './drawer.vue';
export type ChartOfAccountType = 'ledger' | 'subLedger';
export interface IChatOfAccountProps {
  type: ChartOfAccountType;
}
