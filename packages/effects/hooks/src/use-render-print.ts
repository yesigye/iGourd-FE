import JsBarcode from 'jsbarcode';

export const useRenderPrint = () => {
  const renderBarcode = (
    element: HTMLCanvasElement,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    value,
    barCodeProps = {} as JsBarcode.Options,
  ) => {
    JsBarcode(element, value, {
      displayValue: true,
      width: 2,

      format: 'CODE128',
      fontSize: 14,
      font: 'Arial',
      textMargin: 10,
      ...barCodeProps,
    });
  };

  return {
    renderBarcode,
  };
};
