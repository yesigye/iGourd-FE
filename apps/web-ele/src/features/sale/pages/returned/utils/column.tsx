export const columnsVisible = [
  {
    prop: 'product_name',
    width: '200',
    align: 'left',
    fixed: 'left',
    localKey: 'product-name',
    key: 'common',
    isSelect: true,
    disabled: true,
  },
  {
    prop: 'product_code',
    localKey: 'product-code',
    key: 'common',
    width: '200',
    align: 'left',
    isSelect: true,
    disabled: false,
  },
  {
    prop: 'selling_price',
    localKey: 'price',
    key: 'common',
    width: '180',
    align: 'left',
    isSelect: true,
    disabled: false,
  },
  {
    prop: 'product_unit_name',
    localKey: 'unit',
    key: 'common',
    width: '180',
    align: 'left',
    isSelect: true,
    disabled: false,
  },
  {
    prop: 'other_tax_amount',
    localKey: 'tax',
    key: 'common',
    width: '180',
    align: 'left',
    isSelect: true,
    disabled: false,
  },
  {
    prop: 'promotion_discount_amount',
    localKey: 'discount',
    key: 'common',
    width: '180',
    align: 'left',
    isSelect: true,
    disabled: false,
  },
  {
    prop: 'subtotal_amount',
    localKey: 'sub-total',
    key: 'common',
    width: '180',
    align: 'left',
    isSelect: true,
    disabled: false,
    fixed: 'right',
  },
];
export const refundColumns = () => {
  return [
    {
      prop: 'order_returned_no',
      label: 'sales.refund_no',
      key: 'sales',
      render: (row) => {
        return (
          <div className="text-warning">
            <span>{row.order_returned_no}</span>
          </div>
        );
      },
    },
    {
      prop: 'total_quantity',
      label: 'sales.QTY',
      key: 'sales',
    },
    {
      prop: 'total_paid_amount',
      label: 'sales.amount',
      key: 'sales',
    },
    {
      prop: 'customer_contact_name',
      label: 'sales.customer',
      key: 'sales',
    },
    {
      prop: 'create_time',
      label: 'sales.creationTime',
      key: 'sales',
    },
  ];
};
