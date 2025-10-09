/* eslint-disable @typescript-eslint/ban-ts-comment */
import { qsAll } from './dom';

type HeadOpts = {
  breakInside?: 'auto' | 'avoid';
  breakInsideSelectors?: string | string[];
  extraCss?: string | string[];
  extraHead?: string;
  /** 复制 document.adoptedStyleSheets（构造样式表，默认 true） */
  includeAdoptedStyleSheets?: boolean;
  /** 复制 <head> 里的 <style>（默认 true） */
  includeHeadStyles?: boolean;
  /** 注入 <base href> 保持相对路径资源可用（默认 true） */
  injectBaseHref?: boolean;

  paginate?: boolean;
  popTitle?: string;
  styleString?: string;
};

/** 收集 <head>：doctype 无关 */
export function buildHeadHtml(opts: HeadOpts) {
  const styleLinks: string[] = [];
  const headStyleTags: string[] = [];
  const adoptedStyleTexts: string[] = [];

  // 继承当前文档的 <link rel="stylesheet">
  qsAll("link[rel='stylesheet']", document).forEach((lnk) => {
    const href = (lnk as HTMLLinkElement).href;
    if (href) {
      styleLinks.push(`<link rel="stylesheet" type="text/css" href="${href}">`);
    }
  });

  // 额外复制 <style>（SFC scoped / CSS-in-JS 注入到 <head> 的样式）
  try {
    if (opts.includeHeadStyles !== false) {
      const styles = [
        ...(document.head || document).querySelectorAll('style'),
      ] as HTMLStyleElement[];
      styles.forEach((s) => {
        const attrs: string[] = [];
        if ((s as any).getAttributeNames) {
          (s as any)
            .getAttributeNames()
            .forEach((n: string) =>
              attrs.push(`${n}="${s.getAttribute(n) || ''}"`),
            );
        }
        headStyleTags.push(
          `<style ${attrs.join(' ')}>${s.textContent || ''}</style>`,
        );
      });
    }
  } catch {}

  // 用户额外提供的 CSS
  if (opts.extraCss) {
    const extra = Array.isArray(opts.extraCss)
      ? opts.extraCss
      : [opts.extraCss];
    extra.forEach((item) => {
      if (!item) return;
      if (/^\s*<link/i.test(item)) {
        styleLinks.push(item); // 原始 <link> 片段
      } else {
        styleLinks.push(
          `<link rel="stylesheet" type="text/css" href="${item}">`,
        );
      }
    });
  }

  // 复制构造样式表（adoptedStyleSheets）
  try {
    const anyDoc: any = document;
    if (opts.includeAdoptedStyleSheets !== false && anyDoc.adoptedStyleSheets) {
      const sheets = anyDoc.adoptedStyleSheets as any[];
      sheets.forEach((sheet: any) => {
        try {
          const rules = sheet.cssRules;
          if (rules && rules.length > 0) {
            let css = '';
            for (let i = 0; i < rules.length; i++) css += rules[i].cssText;
            adoptedStyleTexts.push(`<style>${css}</style>`);
          }
        } catch {}
      });
    }
  } catch {}

  let inline = `${opts.styleString ?? ''}
html{display:block !important;}
.show-on-print { display:block !important; }
.hide-on-print { display:none !important; }`;

  // 分页 / 断页控制
  const rules: string[] = [];
  const bi = opts.breakInside;
  const sels = Array.isArray(opts.breakInsideSelectors)
    ? opts.breakInsideSelectors
    : // eslint-disable-next-line unicorn/no-nested-ternary
      opts.breakInsideSelectors
      ? [opts.breakInsideSelectors]
      : [];

  if (bi && sels.length === 0) {
    rules.push(
      `@media print{ *{ break-inside:${bi}; page-break-inside:${bi === 'avoid' ? 'avoid' : 'auto'}; } }`,
    );
  } else if (bi && sels.length > 0) {
    const joined = sels
      .map(
        (s) =>
          `${s}{ break-inside:${bi}; page-break-inside:${bi === 'avoid' ? 'avoid' : 'auto'}; }`,
      )
      .join('');
    rules.push(`@media print{ ${joined} }`);
  }
  if (opts.paginate === false) {
    rules.push(
      '@media print{ *{ break-before:auto; break-after:auto; page-break-before:auto; page-break-after:auto; } }',
    );
  }

  inline += `\n${rules.join('\n')}`;

  // 组合 <head>
  const baseTag =
    opts.injectBaseHref === false ? '' : `<base href="${document.baseURI}">`;
  const headPieces = [
    `<title>${opts.popTitle ?? ''}</title>`,
    baseTag,
    styleLinks.join(''),
    headStyleTags.join(''),
    adoptedStyleTexts.join(''),
    opts.extraHead ?? '',
    `<style type="text/css">${inline}</style>`,
  ];
  return `<head>${headPieces.join('')}</head>`;
}

/** 根据标准输出 doctype */
export function buildDocType(standard: 'html5' | 'loose' | 'strict') {
  if (standard === 'html5') return '<!DOCTYPE html>';
  const type = standard === 'strict' ? 'STRICT' : 'TRANSITIONAL';
  const dtd = standard === 'strict' ? 'strict' : 'loose';
  return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01${type}//EN" "http://www.w3.org/TR/html4/${dtd}.dtd">`;
}

/** 克隆并预处理节点：canvas→img、Element-Plus 表头修复、表单值同步、（可选）内联计算样式 */
export function clonePrepared(
  el: HTMLElement,
  opts?: { inlineComputedStyles?: boolean | string[] },
): HTMLElement {
  const cloned = el.cloneNode(true) as HTMLElement;

  // （可选）把计算样式内联到克隆树，兜底极端情况下样式缺失
  try {
    const need = opts && opts.inlineComputedStyles;
    if (need) {
      const whitelist = Array.isArray(need)
        ? (need as string[])
        : [
            'font',
            'font-family',
            'font-size',
            'font-weight',
            'line-height',
            'letter-spacing',
            'color',
            'text-align',
            'white-space',
            'word-break',
            'word-wrap',
            'text-transform',
            'text-decoration',
            'background',
            'background-color',
            'border',
            'border-color',
            'border-width',
            'border-style',
            'box-sizing',
            'padding',
            'margin',
            'display',
            'vertical-align',
            'width',
            'min-width',
            'max-width',
            'height',
            'min-height',
            'max-height',
            'overflow',
            'visibility',
            'opacity',
          ];
      const origEls = [el, ...el.querySelectorAll('*')];
      const clonedEls = [cloned, ...cloned.querySelectorAll('*')];
      const len = Math.min(origEls.length, clonedEls.length);
      for (let i = 0; i < len; i++) {
        const o = origEls[i] as HTMLElement;
        const c = clonedEls[i] as HTMLElement;
        const cs = window.getComputedStyle(o);
        let cssText = c.getAttribute('style') || '';
        whitelist.forEach((prop) => {
          try {
            cssText += `${prop}:${cs.getPropertyValue(prop)};`;
          } catch {}
        });
        c.setAttribute('style', cssText);
      }
    }
  } catch {}

  // canvas -> image（防止跨域污染或样式丢失导致空白）
  const originalCanvas = el.querySelectorAll('canvas');
  const clonedCanvas = cloned.querySelectorAll('canvas');
  for (const [i, clonedCanva] of clonedCanvas.entries()) {
    const c = clonedCanva as HTMLCanvasElement;
    const orig = originalCanvas[i] as HTMLCanvasElement | undefined;
    if (!orig) continue;
    const style = window.getComputedStyle(orig);
    if (style.display === 'none') continue;

    try {
      const data = orig.toDataURL('image/png');
      const img = new Image();
      img.className = 'canvasImg';
      img.style.display = 'none';
      img.src = data;
      c.parentNode?.insertBefore(img, c);
      (c as any).style.display = 'none';
    } catch {
      // tainted canvas — ignore
    }
  }

  // Element-Plus 表格：把 header 的 thead 合并回 body table（虚拟滚动 / 固定表头时被拆分）
  try {
    const tables = [
      ...cloned.querySelectorAll('.el-table__body-wrapper table'),
    ];
    const heads = [
      ...cloned.querySelectorAll('.el-table__header-wrapper table'),
    ];
    if (tables.length > 0 && heads.length > 0) {
      // @ts-ignore
      const thead = heads[0].querySelector('thead');
      if (thead) {
        // @ts-ignore
        tables[0].insertBefore(thead.cloneNode(true), tables[0].firstChild);
      }
    }
  } catch {}

  // 表单值同步
  const formEls = cloned.querySelectorAll('input,select,textarea');
  const origFormEls = el.querySelectorAll('input,select,textarea');
  formEls.forEach((node: any, idx) => {
    const orig: any = origFormEls[idx];
    if (!orig) return;
    const tag = (node.tagName || '').toLowerCase();
    const type = (node.getAttribute('type') || '').toLowerCase();
    if (tag === 'input' && (type === 'checkbox' || type === 'radio')) {
      node.checked = !!orig.checked;
    } else if (tag === 'input' || tag === 'textarea') {
      node.value = orig.value;
      node.setAttribute('value', orig.value);
    } else if (tag === 'select') {
      const opts = node.querySelectorAll('option');
      const origOpts = orig.querySelectorAll('option');
      // @ts-ignore
      opts.forEach((o, i) => {
        (o as HTMLOptionElement).selected = !!(
          (origOpts[i] as HTMLOptionElement) &&
          (origOpts[i] as HTMLOptionElement).selected
        );
      });
    }
  });

  // 最终：显示 canvasImg，移除原 canvas
  cloned.querySelectorAll('.canvasImg,canvas').forEach((n: Element) => {
    const el = n as HTMLElement;
    if (el.tagName.toLowerCase() === 'canvas') {
      el.remove();
    } else if (el.classList.contains('canvasImg')) {
      el.style.display = 'block';
    }
  });

  return cloned;
}

export function buildBodyHtml(
  target: HTMLElement,
  wrapId?: string,
  bleedFixPx?: number,
  cloneOpts?: { inlineComputedStyles?: boolean | string[] },
): string {
  const prepared = clonePrepared(target, cloneOpts);
  const extra =
    bleedFixPx && bleedFixPx > 0
      ? ` style="padding-bottom:${bleedFixPx}px;"`
      : '';
  const open = wrapId ? `<div id="${wrapId}"${extra}>` : '';
  const close = wrapId ? '</div>' : '';
  return `<body style='height:auto !important;overflow:visible !important;'>${open}${prepared.outerHTML}${close}</body>`;
}
