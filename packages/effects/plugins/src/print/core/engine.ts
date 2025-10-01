import type { PrintOptions } from '../types';

import { createBaseIframe, on, removeNode, setHtmlOverflowHidden } from './dom';
import { buildBodyHtml, buildDocType, buildHeadHtml } from './html';

// 仅用于把可能传入的 mm 宽度兼容为 px；内部一律使用 px 布局
const mmToPx = (mm: number) => Math.round((mm * 96) / 25.4);

export class PrintEngine {
  private iframe?: HTMLIFrameElement;
  private previewBody: HTMLElement | null = null;
  private previewBox: HTMLElement | null = null;
  private previewClose: HTMLElement | null = null;
  private previewPrintBtn: HTMLElement | null = null;
  private settings: PrintOptions;

  constructor(options: PrintOptions) {
    this.settings = {
      standard: 'html5',
      zIndex: 20_000,
      preview: false,
      previewTitle: '打印预览',
      previewPrintBtnLabel: '打印',
      paginate: true,
      ...options,
    };
    this.run();
  }

  private cleanup() {
    this.cleanupIframeOnly();
  }

  private cleanupIframeOnly() {
    if (this.iframe) {
      removeNode(this.iframe);
      this.iframe = undefined;
    }
  }

  private composeHtmlString(bodyHtml: string) {
    const head = buildHeadHtml({
      popTitle: this.settings.popTitle,
      styleString: this.settings.styleString,
      extraHead: this.settings.extraHead,
      extraCss: this.settings.extraCss,
      paginate: this.settings.paginate,
      breakInside: (this.settings as any) && (this.settings as any).breakInside,
      breakInsideSelectors:
        (this.settings as any) && (this.settings as any).breakInsideSelectors,

      // 透传“样式带入”增强选项（类型可选）
      includeHeadStyles: (this.settings as any).includeHeadStyles,
      includeAdoptedStyleSheets: (this.settings as any)
        .includeAdoptedStyleSheets,
      injectBaseHref: (this.settings as any).injectBaseHref,
    });
    return `${buildDocType(this.settings.standard || 'html5')}<html>${head}${bodyHtml}</html>`;
  }

  private createIframe(src?: string) {
    // 幂等：若存在旧 iframe，先移除
    if (this.iframe) {
      removeNode(this.iframe);
      this.iframe = undefined;
    }
    const id = this.settings.id || `printArea_${Date.now()}`;
    this.iframe = createBaseIframe(id, src || `about:blank?ts=${Date.now()}`);

    if (this.settings.preview && this.previewBody && this.iframe) {
      this.iframe.style.cssText = 'border:0;flex:1;width:100%;height:100%;';
      this.previewBody.append(this.iframe);
    }
  }

  /** 彻底销毁预览层与 iframe，确保每次进入都是干净环境 */
  private destroyPreviewDom() {
    try {
      if (this.iframe) {
        removeNode(this.iframe);
        this.iframe = undefined;
      }
      if (this.previewBox) {
        removeNode(this.previewBox);
      }
    } finally {
      this.previewBox = null;
      this.previewBody = null;
      this.previewClose = null;
      this.previewPrintBtn = null;
      setHtmlOverflowHidden(false);
    }
  }

  /** 关闭预览：销毁 DOM，清理 iframe */
  private hidePreview() {
    this.destroyPreviewDom();
    this.settings.closeCallback?.();
  }

  private injectContent(content: string) {
    // content 可能是原始 HTML 或 URL
    if (/^\s*</.test(content)) {
      const bodyWrapped = content.includes('<body')
        ? content
        : `<body>${content}</body>`;
      const html = this.composeHtmlString(bodyWrapped);
      this.createIframe();
      this.writeToIframe(html);
    } else {
      this.createIframe(content);
    }
  }

  /** 打开预览：总是重建 DOM（不复用旧的） */
  private openPreview() {
    this.destroyPreviewDom();

    const box = document.createElement('div');
    box.id = 'vue-print-nb-previewBox';
    box.style.cssText = 'position:fixed;inset:0;background:#fff;display:none;';
    box.style.zIndex = String(this.settings.zIndex ?? 20_000);

    const header = document.createElement('div');
    header.className = 'previewHeader';
    header.textContent = this.settings.previewTitle || '打印预览';
    header.style.cssText = 'padding:5px 20px;border-bottom:1px solid #ccc;';
    box.append(header);

    const close = document.createElement('div');
    close.className = 'previewClose';
    close.style.cssText =
      'position:absolute;top:5px;right:20px;width:25px;height:20px;cursor:pointer;';
    const bar1 = document.createElement('div');
    const bar2 = document.createElement('div');
    bar1.style.cssText =
      'position:absolute;width:3px;height:100%;background:#000;transform:rotate(45deg);top:0;left:50%;margin-left:-1.5px;';
    bar2.style.cssText =
      'position:absolute;width:3px;height:100%;background:#000;transform:rotate(-45deg);top:0;left:50%;margin-left:-1.5px;';
    close.append(bar1);
    close.append(bar2);
    box.append(close);

    const util = document.createElement('div');
    util.className = 'previewBodyUtil';
    util.style.cssText =
      'height:32px;background:#474747;position:relative;padding:0 20px;';
    const printBtn = document.createElement('div');
    printBtn.className = 'previewBodyUtilPrintBtn';
    printBtn.textContent = this.settings.previewPrintBtnLabel || '打印';
    printBtn.style.cssText =
      'position:absolute;top:50%;transform:translateY(-50%);right:20px;padding:0 12px;height:24px;line-height:24px;border-radius:3px;background:#4a90e2;color:#fff;cursor:pointer;';
    util.append(printBtn);
    box.append(util);

    const body = document.createElement('div');
    body.className = 'previewBody';
    body.style.cssText =
      'display:flex;flex-direction:column;height:calc(100% - 57px);overflow:auto;padding:12px;';
    box.append(body);

    document.body.append(box);

    this.previewBox = box;
    this.previewBody = body;
    this.previewClose = close;
    this.previewPrintBtn = printBtn;

    on(this.previewClose, 'click', () => this.hidePreview());
    on(this.previewPrintBtn, 'click', () => this.printIframe());

    this.showPreview();
  }

  private printIframe() {
    if (!this.iframe) return;
    try {
      const win = this.iframe.contentWindow!;
      setTimeout(() => {
        win.focus();
        win.print();
        if (this.settings.preview) {
          this.hidePreview();
        } else {
          this.cleanup();
        }
      }, 30);
    } catch (error) {
      console.error('[Print] print() failed', error);
      if (this.settings.preview) this.hidePreview();
      this.cleanup();
    }
  }

  private run() {
    this.settings.beforeOpenCallback?.();

    // 若有残留预览，先清理
    this.destroyPreviewDom();

    if (this.settings.preview) {
      this.openPreview();
    }

    if (this.settings.asyncUrl) {
      this.settings.asyncUrl((content) => {
        this.injectContent(content);
      });
      return;
    }

    if (this.settings.url) {
      this.createIframe(this.settings.url);
      return;
    }

    // 打印现有元素
    const id = (this.settings.ids || '').replaceAll('#', '');
    const target = document.getElementById(id);
    if (!target) {
      console.error(`[Print] Element not found by ids: ${this.settings.ids}`);
      this.cleanup();
      return;
    }

    // ======== 像素布局：外层容器 100%，内容区定宽 + 居中 + 左右 1em padding ========
    const bleedFix = this.settings.bleedFixPx ?? 0; // 避免底部额外留白

    // 内层固定宽内容区（便于 padding 和居中）
    const WRAP_ID = '__receipt_wrap__';

    // 统一“屏幕 + 打印”的布局，确保预览与打印一致
    // - 外层容器：body 宽度 100%，背景透明
    // - 内容区：固定 px 宽、1em 左右内边距、margin:0 auto 居中、背景透明
    const pageCss = `
@page { margin: 0; }

/* 屏幕与打印统一规则：所见即所得 */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;        /* 外层容器 100% */
  background: transparent !important;  /* 背景透明 */
}

#${WRAP_ID} {
  box-sizing: border-box;
  padding-left: 1em;              /* 左右 1em */
  padding-right: 1em;
  margin: 0 auto;                 /* ✅ 居中 */
  background: transparent !important;
}
  /* 防止内层元素把容器撑破，尤其是表格/图片 */
#${WRAP_ID} img,
#${WRAP_ID} canvas,
#${WRAP_ID} svg,
#${WRAP_ID} video {
  max-width: 100% !important;
  height: auto !important;
}

#${WRAP_ID} table {
  max-width: 100% !important;
  width: 100% !important;     /* 如果你的表格本就定宽，可去掉这一行 */
  table-layout: auto;         /* 或者根据你业务换成 fixed */
  border-collapse: collapse;  /* 保守项，避免边框把总宽向外挤 */
}

@media print {
  html, body { width: 100% !important; }
}
`;

    // 注入样式（合并到 styleString 里）
    this.settings.styleString = `${this.settings.styleString || ''}\n${pageCss}`;
    // ======== /像素布局 ========

    const html = this.composeHtmlString(
      buildBodyHtml(target, WRAP_ID, bleedFix, {
        inlineComputedStyles: (this.settings as any).inlineComputedStyles,
      }),
    );
    this.createIframe();
    this.writeToIframe(html);
  }

  private showPreview() {
    if (!this.previewBox) return;
    setHtmlOverflowHidden(true);
    this.previewBox.style.display = 'block';
    this.settings.previewOpenCallback?.();
  }

  private writeToIframe(html: string) {
    if (!this.iframe) this.createIframe();
    if (!this.iframe) return;
    const doc =
      this.iframe.contentDocument || this.iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
    this.settings.openCallback?.();

    if (!this.settings.preview) {
      this.printIframe();
    }
  }
}
