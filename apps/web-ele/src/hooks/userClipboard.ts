import Clipboard from 'clipboard';

type ClipboardProps = {
  data: string;
  fail?: (e: ClipboardJS.Event) => void;
  success?: (e: ClipboardJS.Event) => void;
};

export const userClipboard = () => {
  const setClipboardData = (
    options: ClipboardProps = { data: '', success: () => {}, fail: () => {} },
  ) => {
    const fakeEl = document.createElement('button');
    const clipboard = new Clipboard(fakeEl, {
      text() {
        return options.data || '';
      },
      action() {
        return 'copy';
      },
      container: document.body,
    });
    clipboard.on('success', (e: ClipboardJS.Event) => {
      clipboard.destroy();
      if (options.success) {
        options.success(e);
      }
    });
    clipboard.on('error', (e: ClipboardJS.Event) => {
      clipboard.destroy();
      if (options.fail) {
        options.fail(e);
      }
    });
    document.body.append(fakeEl);
    fakeEl.click();
    fakeEl.remove();
  };
  return { setClipboardData };
};
