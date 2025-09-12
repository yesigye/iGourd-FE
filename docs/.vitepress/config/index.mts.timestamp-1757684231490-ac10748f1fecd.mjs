// .vitepress/config/index.mts
import { withPwa } from "file:///D:/codes/igourd-shared/node_modules/.pnpm/@vite-pwa+vitepress@1.0.0_v_05fae118853e191cc54f7527ee997d31/node_modules/@vite-pwa/vitepress/dist/index.mjs";
import { defineConfigWithTheme } from "file:///D:/codes/igourd-shared/node_modules/.pnpm/vitepress@1.6.3_@algolia+cl_ad674ef88d58bdb2716d55dc92f3e305/node_modules/vitepress/dist/node/index.js";

// .vitepress/config/en.mts
import { defineConfig } from "file:///D:/codes/igourd-shared/node_modules/.pnpm/vitepress@1.6.3_@algolia+cl_ad674ef88d58bdb2716d55dc92f3e305/node_modules/vitepress/dist/node/index.js";

// ../package.json
var version = "5.6.2-beta.10";

// .vitepress/config/en.mts
var en = defineConfig({
  description: "Igourd Admin & Enterprise level management system framework",
  lang: "en-US",
  themeConfig: {
    darkModeSwitchLabel: "Theme",
    darkModeSwitchTitle: "Switch to Dark Mode",
    docFooter: {
      next: "Next Page",
      prev: "Previous Page"
    },
    editLink: {
      pattern: "https://github.com/igourdjs/vue-igourd-admin/edit/main/docs/src/:path",
      text: "Edit this page on GitHub"
    },
    footer: {
      copyright: `Copyright \xA9 2020-${(/* @__PURE__ */ new Date()).getFullYear()} Igourd`,
      message: "Released under the MIT License."
    },
    langMenuLabel: "Language",
    lastUpdated: {
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium"
      },
      text: "Last updated on"
    },
    lightModeSwitchTitle: "Switch to Light Mode",
    nav: nav(),
    outline: {
      label: "Navigate"
    },
    returnToTopLabel: "Back to top",
    sidebar: {
      "/en/commercial/": {
        base: "/en/commercial/",
        items: sidebarCommercial()
      },
      "/en/guide/": { base: "/en/guide/", items: sidebarGuide() }
    }
  }
});
function sidebarGuide() {
  return [
    {
      collapsed: false,
      text: "Introduction",
      items: [
        {
          link: "introduction/igourd",
          text: "About Igourd Admin"
        },
        {
          link: "introduction/why",
          text: "Why Choose Us?"
        },
        { link: "introduction/quick-start", text: "Quick Start" },
        { link: "introduction/thin", text: "Lite Version" }
      ]
    },
    {
      text: "Basics",
      items: [
        { link: "essentials/concept", text: "Basic Concepts" },
        { link: "essentials/development", text: "Local Development" },
        { link: "essentials/route", text: "Routing and Menu" },
        { link: "essentials/settings", text: "Configuration" },
        { link: "essentials/icons", text: "Icons" },
        { link: "essentials/styles", text: "Styles" },
        { link: "essentials/external-module", text: "External Modules" },
        { link: "essentials/build", text: "Build and Deployment" },
        { link: "essentials/server", text: "Server Interaction and Data Mock" }
      ]
    },
    {
      text: "Advanced",
      items: [
        { link: "in-depth/login", text: "Login" },
        { link: "in-depth/theme", text: "Theme" },
        { link: "in-depth/access", text: "Access Control" },
        { link: "in-depth/locale", text: "Internationalization" },
        { link: "in-depth/features", text: "Common Features" },
        { link: "in-depth/check-updates", text: "Check Updates" },
        { link: "in-depth/loading", text: "Global Loading" },
        { link: "in-depth/ui-framework", text: "UI Framework Switching" }
      ]
    },
    {
      text: "Engineering",
      items: [
        { link: "project/standard", text: "Standards" },
        { link: "project/cli", text: "CLI" },
        { link: "project/dir", text: "Directory Explanation" },
        { link: "project/test", text: "Unit Testing" },
        { link: "project/tailwindcss", text: "Tailwind CSS" },
        { link: "project/changeset", text: "Changeset" },
        { link: "project/vite", text: "Vite Config" }
      ]
    },
    {
      text: "Others",
      items: [
        { link: "other/project-update", text: "Project Update" },
        { link: "other/remove-code", text: "Remove Code" },
        { link: "other/faq", text: "FAQ" }
      ]
    }
  ];
}
function sidebarCommercial() {
  return [
    {
      link: "community",
      text: "Community"
    },
    {
      link: "technical-support",
      text: "Technical-support"
    },
    {
      link: "customized",
      text: "Customized"
    }
  ];
}
function nav() {
  return [
    {
      activeMatch: "^/en/(guide|components)/",
      text: "Doc",
      items: [
        {
          activeMatch: "^/en/guide/",
          link: "/en/guide/introduction/igourd",
          text: "Guide"
        },
        // {
        //   activeMatch: '^/en/components/',
        //   link: '/en/components/introduction',
        //   text: 'Components',
        // },
        {
          text: "Historical Versions",
          items: [
            {
              link: "https://doc.vvbin.cn",
              text: "2.x Version Documentation"
            }
          ]
        }
      ]
    },
    {
      text: "Demo",
      items: [
        {
          text: "Igourd Admin",
          items: [
            {
              link: "https://www.igourd.pro",
              text: "Demo Version"
            },
            {
              link: "https://ant.igourd.pro",
              text: "Ant Design Vue Version"
            },
            {
              link: "https://naive.igourd.pro",
              text: "Naive Version"
            },
            {
              link: "https://ele.igourd.pro",
              text: "Element Plus Version"
            }
          ]
        },
        {
          text: "Others",
          items: [
            {
              link: "https://igourd.vvbin.cn",
              text: "Igourd Admin 2.x"
            }
          ]
        }
      ]
    },
    {
      text: version,
      items: [
        {
          link: "https://github.com/igourdjs/vue-igourd-admin/releases",
          text: "Changelog"
        },
        {
          link: "https://github.com/orgs/igourdjs/projects/5",
          text: "Roadmap"
        },
        {
          link: "https://github.com/igourdjs/vue-igourd-admin/blob/main/.github/contributing.md",
          text: "Contribution"
        }
      ]
    },
    {
      link: "/commercial/technical-support",
      text: "\u{1F984} Tech Support"
    },
    {
      link: "/sponsor/personal",
      text: "\u2728 Sponsor"
    },
    {
      link: "/commercial/community",
      text: "\u{1F468}\u200D\u{1F466}\u200D\u{1F466} Community"
    }
    // {
    //   link: '/friend-links/',
    //   text: '🤝 Friend Links',
    // },
  ];
}

// .vitepress/config/shared.mts
import { resolve } from "node:path";
import {
  viteArchiverPlugin,
  viteVxeTableImportsPlugin
} from "file:///D:/codes/igourd-shared/internal/vite-config/dist/index.mjs";
import {
  GitChangelog,
  GitChangelogMarkdownSection
} from "file:///D:/codes/igourd-shared/node_modules/.pnpm/@nolebase+vitepress-plugin-_e9c330cce53c87984f3933f09e8f6773/node_modules/@nolebase/vitepress-plugin-git-changelog/dist/vite/index.mjs";
import tailwind from "file:///D:/codes/igourd-shared/node_modules/.pnpm/tailwindcss@3.4.17_ts-node@9.1.1_typescript@5.8.3_/node_modules/tailwindcss/lib/index.js";
import { defineConfig as defineConfig3, postcssIsolateStyles } from "file:///D:/codes/igourd-shared/node_modules/.pnpm/vitepress@1.6.3_@algolia+cl_ad674ef88d58bdb2716d55dc92f3e305/node_modules/vitepress/dist/node/index.js";
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from "file:///D:/codes/igourd-shared/node_modules/.pnpm/vitepress-plugin-group-icon_064b5a096b6908f4fb4f59f2da0be951/node_modules/vitepress-plugin-group-icons/dist/index.js";

// .vitepress/config/plugins/demo-preview.ts
import crypto from "node:crypto";
import { readdirSync } from "node:fs";
import { join } from "node:path";
var rawPathRegexp = (
  // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/strict
  /^(.+?(?:\.([\da-z]+))?)(#[\w-]+)?(?: ?{(\d+(?:[,-]\d+)*)? ?(\S+)?})? ?(?:\[(.+)])?$/
);
function rawPathToToken(rawPath) {
  const [
    filepath = "",
    extension = "",
    region = "",
    lines = "",
    lang = "",
    rawTitle = ""
  ] = (rawPathRegexp.exec(rawPath) || []).slice(1);
  const title = rawTitle || filepath.split("/").pop() || "";
  return { extension, filepath, lang, lines, region, title };
}
var demoPreviewPlugin = (md) => {
  md.core.ruler.after("inline", "demo-preview", (state) => {
    const insertComponentImport = (importString) => {
      const index = state.tokens.findIndex(
        (i) => i.type === "html_block" && i.content.match(/<script setup>/g)
      );
      if (index === -1) {
        const importComponent = new state.Token("html_block", "", 0);
        importComponent.content = `<script setup>
${importString}
</script>
`;
        state.tokens.splice(0, 0, importComponent);
      } else {
        if (state.tokens[index]) {
          const content = state.tokens[index].content;
          state.tokens[index].content = content.replace(
            "</script>",
            `${importString}
</script>`
          );
        }
      }
    };
    const regex = /<DemoPreview[^>]*\sdir="([^"]*)"/g;
    state.src = state.src.replaceAll(regex, (_match, dir) => {
      const componentDir = join(process.cwd(), "src", dir).replaceAll(
        "\\",
        "/"
      );
      let childFiles = [];
      let dirExists = true;
      try {
        childFiles = readdirSync(componentDir, {
          encoding: "utf8",
          recursive: false,
          withFileTypes: false
        }) || [];
      } catch {
        dirExists = false;
      }
      if (!dirExists) {
        return "";
      }
      const uniqueWord = generateContentHash(componentDir);
      const ComponentName = `DemoComponent_${uniqueWord}`;
      insertComponentImport(
        `import ${ComponentName} from '${componentDir}/index.vue'`
      );
      const { path: _path } = state.env;
      const index = state.tokens.findIndex((i) => i.content.match(regex));
      if (!state.tokens[index]) {
        return "";
      }
      const firstString = "index.vue";
      childFiles = childFiles.sort((a, b) => {
        if (a === firstString) return -1;
        if (b === firstString) return 1;
        return a.localeCompare(b, "en", { sensitivity: "base" });
      });
      state.tokens[index].content = `<DemoPreview files="${encodeURIComponent(JSON.stringify(childFiles))}" ><${ComponentName}/>
        `;
      const _dummyToken = new state.Token("", "", 0);
      const tokenArray = [];
      childFiles.forEach((filename) => {
        const templateStart = new state.Token("html_inline", "", 0);
        templateStart.content = `<template #${filename}>`;
        tokenArray.push(templateStart);
        const resolvedPath = join(componentDir, filename);
        const { extension, filepath, lang, lines, title } = rawPathToToken(resolvedPath);
        const token = new state.Token("fence", "code", 0);
        token.info = `${lang || extension}${lines ? `{${lines}}` : ""}${title ? `[${title}]` : ""}`;
        token.content = `<<< ${filepath}`;
        token.src = [resolvedPath];
        tokenArray.push(token);
        const templateEnd = new state.Token("html_inline", "", 0);
        templateEnd.content = "</template>";
        tokenArray.push(templateEnd);
      });
      const endTag = new state.Token("html_inline", "", 0);
      endTag.content = "</DemoPreview>";
      tokenArray.push(endTag);
      state.tokens.splice(index + 1, 0, ...tokenArray);
      return "";
    });
  });
};
function generateContentHash(input, length = 10) {
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  return Number.parseInt(hash, 16).toString(36).slice(0, length);
}

// .vitepress/config/zh.mts
import { defineConfig as defineConfig2 } from "file:///D:/codes/igourd-shared/node_modules/.pnpm/vitepress@1.6.3_@algolia+cl_ad674ef88d58bdb2716d55dc92f3e305/node_modules/vitepress/dist/node/index.js";
var zh = defineConfig2({
  description: "Igourd Admin & \u4F01\u4E1A\u7EA7\u7BA1\u7406\u7CFB\u7EDF\u6846\u67B6",
  lang: "zh-Hans",
  themeConfig: {
    darkModeSwitchLabel: "\u4E3B\u9898",
    darkModeSwitchTitle: "\u5207\u6362\u5230\u6DF1\u8272\u6A21\u5F0F",
    docFooter: {
      next: "\u4E0B\u4E00\u9875",
      prev: "\u4E0A\u4E00\u9875"
    },
    editLink: {
      pattern: "https://github.com/igourdjs/vue-igourd-admin/edit/main/docs/src/:path",
      text: "\u5728 GitHub \u4E0A\u7F16\u8F91\u6B64\u9875\u9762"
    },
    footer: {
      copyright: `Copyright \xA9 2020-${(/* @__PURE__ */ new Date()).getFullYear()} Igourd`,
      message: "\u57FA\u4E8E MIT \u8BB8\u53EF\u53D1\u5E03."
    },
    langMenuLabel: "\u591A\u8BED\u8A00",
    lastUpdated: {
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium"
      },
      text: "\u6700\u540E\u66F4\u65B0\u4E8E"
    },
    lightModeSwitchTitle: "\u5207\u6362\u5230\u6D45\u8272\u6A21\u5F0F",
    nav: nav2(),
    outline: {
      label: "\u9875\u9762\u5BFC\u822A"
    },
    returnToTopLabel: "\u56DE\u5230\u9876\u90E8",
    sidebar: {
      "/commercial/": { base: "/commercial/", items: sidebarCommercial2() },
      "/components/": { base: "/components/", items: sidebarComponents() },
      "/guide/": { base: "/guide/", items: sidebarGuide2() }
    },
    sidebarMenuLabel: "\u83DC\u5355"
  }
});
function sidebarGuide2() {
  return [
    {
      collapsed: false,
      text: "\u7B80\u4ECB",
      items: [
        {
          link: "introduction/igourd",
          text: "\u5173\u4E8E Igourd Admin"
        },
        {
          link: "introduction/why",
          text: "\u4E3A\u4EC0\u4E48\u9009\u62E9\u6211\u4EEC?"
        },
        { link: "introduction/quick-start", text: "\u5FEB\u901F\u5F00\u59CB" },
        { link: "introduction/thin", text: "\u7CBE\u7B80\u7248\u672C" },
        {
          base: "/",
          link: "components/introduction",
          text: "\u7EC4\u4EF6\u6587\u6863"
        }
      ]
    },
    {
      text: "\u57FA\u7840",
      items: [
        { link: "essentials/concept", text: "\u57FA\u7840\u6982\u5FF5" },
        { link: "essentials/development", text: "\u672C\u5730\u5F00\u53D1" },
        { link: "essentials/route", text: "\u8DEF\u7531\u548C\u83DC\u5355" },
        { link: "essentials/settings", text: "\u914D\u7F6E" },
        { link: "essentials/icons", text: "\u56FE\u6807" },
        { link: "essentials/styles", text: "\u6837\u5F0F" },
        { link: "essentials/external-module", text: "\u5916\u90E8\u6A21\u5757" },
        { link: "essentials/build", text: "\u6784\u5EFA\u4E0E\u90E8\u7F72" },
        { link: "essentials/server", text: "\u670D\u52A1\u7AEF\u4EA4\u4E92\u4E0E\u6570\u636EMock" }
      ]
    },
    {
      text: "\u6DF1\u5165",
      items: [
        { link: "in-depth/login", text: "\u767B\u5F55" },
        // { link: 'in-depth/layout', text: '布局' },
        { link: "in-depth/theme", text: "\u4E3B\u9898" },
        { link: "in-depth/access", text: "\u6743\u9650" },
        { link: "in-depth/locale", text: "\u56FD\u9645\u5316" },
        { link: "in-depth/features", text: "\u5E38\u7528\u529F\u80FD" },
        { link: "in-depth/check-updates", text: "\u68C0\u67E5\u66F4\u65B0" },
        { link: "in-depth/loading", text: "\u5168\u5C40loading" },
        { link: "in-depth/ui-framework", text: "\u7EC4\u4EF6\u5E93\u5207\u6362" }
      ]
    },
    {
      text: "\u5DE5\u7A0B",
      items: [
        { link: "project/standard", text: "\u89C4\u8303" },
        { link: "project/cli", text: "CLI" },
        { link: "project/dir", text: "\u76EE\u5F55\u8BF4\u660E" },
        { link: "project/test", text: "\u5355\u5143\u6D4B\u8BD5" },
        { link: "project/tailwindcss", text: "Tailwind CSS" },
        { link: "project/changeset", text: "Changeset" },
        { link: "project/vite", text: "Vite Config" }
      ]
    },
    {
      text: "\u5176\u4ED6",
      items: [
        { link: "other/project-update", text: "\u9879\u76EE\u66F4\u65B0" },
        { link: "other/remove-code", text: "\u79FB\u9664\u4EE3\u7801" },
        { link: "other/faq", text: "\u5E38\u89C1\u95EE\u9898" }
      ]
    }
  ];
}
function sidebarCommercial2() {
  return [
    {
      link: "community",
      text: "\u4EA4\u6D41\u7FA4"
    },
    {
      link: "technical-support",
      text: "\u6280\u672F\u652F\u6301"
    },
    {
      link: "customized",
      text: "\u5B9A\u5236\u5F00\u53D1"
    }
  ];
}
function sidebarComponents() {
  return [
    {
      text: "\u7EC4\u4EF6",
      items: [
        {
          link: "introduction",
          text: "\u4ECB\u7ECD"
        }
      ]
    },
    {
      collapsed: false,
      text: "\u5E03\u5C40\u7EC4\u4EF6",
      items: [
        {
          link: "layout-ui/page",
          text: "Page \u9875\u9762"
        }
      ]
    },
    {
      collapsed: false,
      text: "\u901A\u7528\u7EC4\u4EF6",
      items: [
        {
          link: "common-ui/igourd-api-component",
          text: "ApiComponent Api\u7EC4\u4EF6\u5305\u88C5\u5668"
        },
        {
          link: "common-ui/igourd-alert",
          text: "Alert \u8F7B\u91CF\u63D0\u793A\u6846"
        },
        {
          link: "common-ui/igourd-modal",
          text: "Modal \u6A21\u6001\u6846"
        },
        {
          link: "common-ui/igourd-drawer",
          text: "Drawer \u62BD\u5C49"
        },
        {
          link: "common-ui/igourd-form",
          text: "Form \u8868\u5355"
        },
        {
          link: "common-ui/igourd-vxe-table",
          text: "Vxe Table \u8868\u683C"
        },
        {
          link: "common-ui/igourd-count-to-animator",
          text: "CountToAnimator \u6570\u5B57\u52A8\u753B"
        },
        {
          link: "common-ui/igourd-ellipsis-text",
          text: "EllipsisText \u7701\u7565\u6587\u672C"
        }
      ]
    }
  ];
}
function nav2() {
  return [
    {
      activeMatch: "^/(guide|components)/",
      text: "\u6587\u6863",
      items: [
        {
          activeMatch: "^/guide/",
          link: "/guide/introduction/igourd",
          text: "\u6307\u5357"
        },
        {
          activeMatch: "^/components/",
          link: "/components/introduction",
          text: "\u7EC4\u4EF6"
        },
        {
          text: "\u5386\u53F2\u7248\u672C",
          items: [
            {
              link: "https://doc.vvbin.cn",
              text: "2.x\u7248\u672C\u6587\u6863"
            }
          ]
        }
      ]
    },
    {
      text: "\u6F14\u793A",
      items: [
        {
          text: "Igourd Admin",
          items: [
            {
              link: "https://www.igourd.pro",
              text: "\u6F14\u793A\u7248\u672C"
            },
            {
              link: "https://ant.igourd.pro",
              text: "Ant Design Vue \u7248\u672C"
            },
            {
              link: "https://naive.igourd.pro",
              text: "Naive \u7248\u672C"
            },
            {
              link: "https://ele.igourd.pro",
              text: "Element Plus\u7248\u672C"
            }
          ]
        },
        {
          text: "\u5176\u4ED6",
          items: [
            {
              link: "https://igourd.vvbin.cn",
              text: "Igourd Admin 2.x"
            }
          ]
        }
      ]
    },
    {
      text: version,
      items: [
        {
          link: "https://github.com/igourdjs/vue-igourd-admin/releases",
          text: "\u66F4\u65B0\u65E5\u5FD7"
        },
        {
          link: "https://github.com/orgs/igourdjs/projects/5",
          text: "\u8DEF\u7EBF\u56FE"
        },
        {
          link: "https://github.com/igourdjs/vue-igourd-admin/blob/main/.github/contributing.md",
          text: "\u8D21\u732E"
        }
      ]
    },
    {
      link: "/commercial/technical-support",
      text: "\u{1F984} \u6280\u672F\u652F\u6301"
    },
    {
      link: "/sponsor/personal",
      text: "\u2728 \u8D5E\u52A9"
    },
    {
      link: "/commercial/community",
      text: "\u{1F468}\u200D\u{1F466}\u200D\u{1F466} \u4EA4\u6D41\u7FA4"
      // items: [
      //   {
      //     link: 'https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=22ySzj7pKiw&businessType=9&from=246610&biz=ka&mainSourceId=share&subSourceId=others&jumpsource=shorturl#/pc',
      //     text: 'QQ频道',
      //   },
      //   {
      //     link: 'https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=mjZmlhgVzzUxvdxllB6C1vHpX8O8QRL0&authKey=DBdFbBwERmfaKY95JvRWqLCJIRGJAmKyZbrpzZ41EKDMZ5SR6MfbjOBaaNRN73fr&noverify=0&group_code=4286109',
      //     text: 'QQ群',
      //   },
      //   {
      //     link: 'https://discord.gg/VU62jTecad',
      //     text: 'Discord',
      //   },
      // ],
    }
    // {
    //   link: '/friend-links/',
    //   text: '🤝 友情链接',
    // },
  ];
}
var search = {
  root: {
    placeholder: "\u641C\u7D22\u6587\u6863",
    translations: {
      button: {
        buttonAriaLabel: "\u641C\u7D22\u6587\u6863",
        buttonText: "\u641C\u7D22\u6587\u6863"
      },
      modal: {
        errorScreen: {
          helpText: "\u4F60\u53EF\u80FD\u9700\u8981\u68C0\u67E5\u4F60\u7684\u7F51\u7EDC\u8FDE\u63A5",
          titleText: "\u65E0\u6CD5\u83B7\u53D6\u7ED3\u679C"
        },
        footer: {
          closeText: "\u5173\u95ED",
          navigateText: "\u5207\u6362",
          searchByText: "\u641C\u7D22\u63D0\u4F9B\u8005",
          selectText: "\u9009\u62E9"
        },
        noResultsScreen: {
          noResultsText: "\u65E0\u6CD5\u627E\u5230\u76F8\u5173\u7ED3\u679C",
          reportMissingResultsLinkText: "\u70B9\u51FB\u53CD\u9988",
          reportMissingResultsText: "\u4F60\u8BA4\u4E3A\u8BE5\u67E5\u8BE2\u5E94\u8BE5\u6709\u7ED3\u679C\uFF1F",
          suggestedQueryText: "\u4F60\u53EF\u4EE5\u5C1D\u8BD5\u67E5\u8BE2"
        },
        searchBox: {
          cancelButtonAriaLabel: "\u53D6\u6D88",
          cancelButtonText: "\u53D6\u6D88",
          resetButtonAriaLabel: "\u6E05\u9664\u67E5\u8BE2\u6761\u4EF6",
          resetButtonTitle: "\u6E05\u9664\u67E5\u8BE2\u6761\u4EF6"
        },
        startScreen: {
          favoriteSearchesTitle: "\u6536\u85CF",
          noRecentSearchesText: "\u6CA1\u6709\u641C\u7D22\u5386\u53F2",
          recentSearchesTitle: "\u641C\u7D22\u5386\u53F2",
          removeFavoriteSearchButtonTitle: "\u4ECE\u6536\u85CF\u4E2D\u79FB\u9664",
          removeRecentSearchButtonTitle: "\u4ECE\u641C\u7D22\u5386\u53F2\u4E2D\u79FB\u9664",
          saveRecentSearchButtonTitle: "\u4FDD\u5B58\u81F3\u641C\u7D22\u5386\u53F2"
        }
      }
    }
  }
};

// .vitepress/config/shared.mts
var shared = defineConfig3({
  appearance: "dark",
  head: head(),
  markdown: {
    preConfig(md) {
      md.use(demoPreviewPlugin);
      md.use(groupIconMdPlugin);
    }
  },
  pwa: pwa(),
  srcDir: "src",
  themeConfig: {
    i18nRouting: true,
    logo: "https://unpkg.com/@igourdjs/static-source@0.1.7/source/logo-v1.webp",
    search: {
      options: {
        locales: {
          ...search
        }
      },
      provider: "local"
    },
    siteTitle: "Igourd Admin",
    socialLinks: [
      { icon: "github", link: "https://github.com/igourdjs/vue-igourd-admin" }
    ]
  },
  title: "Igourd Admin",
  vite: {
    build: {
      chunkSizeWarningLimit: Infinity,
      minify: "terser"
    },
    css: {
      postcss: {
        plugins: [
          tailwind(),
          postcssIsolateStyles({ includeFiles: [/vp-doc\.css/] })
        ]
      },
      preprocessorOptions: {
        scss: {
          api: "modern"
        }
      }
    },
    json: {
      stringify: true
    },
    plugins: [
      GitChangelog({
        mapAuthors: [
          {
            mapByNameAliases: ["Igourd"],
            name: "igourd",
            username: "anncwb"
          },
          {
            name: "vince",
            username: "vince292007"
          },
          {
            name: "Li Kui",
            username: "likui628"
          }
        ],
        repoURL: () => "https://github.com/igourdjs/vue-igourd-admin"
      }),
      GitChangelogMarkdownSection(),
      viteArchiverPlugin({ outputDir: ".vitepress" }),
      groupIconVitePlugin(),
      await viteVxeTableImportsPlugin()
    ],
    server: {
      fs: {
        allow: ["../.."]
      },
      host: true,
      port: 6173
    },
    ssr: {
      external: ["@vue/repl"]
    }
  }
});
function head() {
  return [
    ["meta", { content: "Igourdjs Team", name: "author" }],
    [
      "meta",
      {
        content: "igourd, vitejs, vite, shacdn-ui, vue",
        name: "keywords"
      }
    ],
    ["link", { href: "/favicon.ico", rel: "icon", type: "image/svg+xml" }],
    [
      "meta",
      {
        content: "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
        name: "viewport"
      }
    ],
    ["meta", { content: "igourd admin docs", name: "keywords" }],
    ["link", { href: "/favicon.ico", rel: "icon" }]
    // [
    //   'script',
    //   {
    //     src: 'https://cdn.tailwindcss.com',
    //   },
    // ],
  ];
}
function pwa() {
  return {
    includeManifestIcons: false,
    manifest: {
      description: "Igourd Admin is a modern admin dashboard template based on Vue 3. ",
      icons: [
        {
          sizes: "192x192",
          src: "https://unpkg.com/@igourdjs/static-source@0.1.7/source/pwa-icon-192.png",
          type: "image/png"
        },
        {
          sizes: "512x512",
          src: "https://unpkg.com/@igourdjs/static-source@0.1.7/source/pwa-icon-512.png",
          type: "image/png"
        }
      ],
      id: "/",
      name: "Igourd Admin Doc",
      short_name: "igourd_admin_doc",
      theme_color: "#ffffff"
    },
    outDir: resolve(process.cwd(), ".vitepress/dist"),
    registerType: "autoUpdate",
    workbox: {
      globPatterns: ["**/*.{css,js,html,svg,png,ico,txt,woff2}"],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
    }
  };
}

// .vitepress/config/index.mts
var index_default = withPwa(
  defineConfigWithTheme({
    ...shared,
    locales: {
      en: {
        label: "English",
        lang: "en",
        link: "/en/",
        ...en
      },
      root: {
        label: "\u7B80\u4F53\u4E2D\u6587",
        lang: "zh-CN",
        ...zh
      }
    }
  })
);
export {
  index_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy9jb25maWcvaW5kZXgubXRzIiwgIi52aXRlcHJlc3MvY29uZmlnL2VuLm10cyIsICIuLi9wYWNrYWdlLmpzb24iLCAiLnZpdGVwcmVzcy9jb25maWcvc2hhcmVkLm10cyIsICIudml0ZXByZXNzL2NvbmZpZy9wbHVnaW5zL2RlbW8tcHJldmlldy50cyIsICIudml0ZXByZXNzL2NvbmZpZy96aC5tdHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjb2Rlc1xcXFxpZ291cmQtc2hhcmVkXFxcXGRvY3NcXFxcLnZpdGVwcmVzc1xcXFxjb25maWdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGNvZGVzXFxcXGlnb3VyZC1zaGFyZWRcXFxcZG9jc1xcXFwudml0ZXByZXNzXFxcXGNvbmZpZ1xcXFxpbmRleC5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2NvZGVzL2lnb3VyZC1zaGFyZWQvZG9jcy8udml0ZXByZXNzL2NvbmZpZy9pbmRleC5tdHNcIjtpbXBvcnQgeyB3aXRoUHdhIH0gZnJvbSAnQHZpdGUtcHdhL3ZpdGVwcmVzcyc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWdXaXRoVGhlbWUgfSBmcm9tICd2aXRlcHJlc3MnO1xuXG5pbXBvcnQgeyBlbiB9IGZyb20gJy4vZW4ubXRzJztcbmltcG9ydCB7IHNoYXJlZCB9IGZyb20gJy4vc2hhcmVkLm10cyc7XG5pbXBvcnQgeyB6aCB9IGZyb20gJy4vemgubXRzJztcblxuZXhwb3J0IGRlZmF1bHQgd2l0aFB3YShcbiAgZGVmaW5lQ29uZmlnV2l0aFRoZW1lKHtcbiAgICAuLi5zaGFyZWQsXG4gICAgbG9jYWxlczoge1xuICAgICAgZW46IHtcbiAgICAgICAgbGFiZWw6ICdFbmdsaXNoJyxcbiAgICAgICAgbGFuZzogJ2VuJyxcbiAgICAgICAgbGluazogJy9lbi8nLFxuICAgICAgICAuLi5lbixcbiAgICAgIH0sXG4gICAgICByb290OiB7XG4gICAgICAgIGxhYmVsOiAnXHU3QjgwXHU0RjUzXHU0RTJEXHU2NTg3JyxcbiAgICAgICAgbGFuZzogJ3poLUNOJyxcbiAgICAgICAgLi4uemgsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pLFxuKTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcY29kZXNcXFxcaWdvdXJkLXNoYXJlZFxcXFxkb2NzXFxcXC52aXRlcHJlc3NcXFxcY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjb2Rlc1xcXFxpZ291cmQtc2hhcmVkXFxcXGRvY3NcXFxcLnZpdGVwcmVzc1xcXFxjb25maWdcXFxcZW4ubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9jb2Rlcy9pZ291cmQtc2hhcmVkL2RvY3MvLnZpdGVwcmVzcy9jb25maWcvZW4ubXRzXCI7aW1wb3J0IHR5cGUgeyBEZWZhdWx0VGhlbWUgfSBmcm9tICd2aXRlcHJlc3MnO1xuXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlcHJlc3MnO1xuXG5pbXBvcnQgeyB2ZXJzaW9uIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZS5qc29uJztcblxuZXhwb3J0IGNvbnN0IGVuID0gZGVmaW5lQ29uZmlnKHtcbiAgZGVzY3JpcHRpb246ICdJZ291cmQgQWRtaW4gJiBFbnRlcnByaXNlIGxldmVsIG1hbmFnZW1lbnQgc3lzdGVtIGZyYW1ld29yaycsXG4gIGxhbmc6ICdlbi1VUycsXG4gIHRoZW1lQ29uZmlnOiB7XG4gICAgZGFya01vZGVTd2l0Y2hMYWJlbDogJ1RoZW1lJyxcbiAgICBkYXJrTW9kZVN3aXRjaFRpdGxlOiAnU3dpdGNoIHRvIERhcmsgTW9kZScsXG4gICAgZG9jRm9vdGVyOiB7XG4gICAgICBuZXh0OiAnTmV4dCBQYWdlJyxcbiAgICAgIHByZXY6ICdQcmV2aW91cyBQYWdlJyxcbiAgICB9LFxuICAgIGVkaXRMaW5rOiB7XG4gICAgICBwYXR0ZXJuOlxuICAgICAgICAnaHR0cHM6Ly9naXRodWIuY29tL2lnb3VyZGpzL3Z1ZS1pZ291cmQtYWRtaW4vZWRpdC9tYWluL2RvY3Mvc3JjLzpwYXRoJyxcbiAgICAgIHRleHQ6ICdFZGl0IHRoaXMgcGFnZSBvbiBHaXRIdWInLFxuICAgIH0sXG4gICAgZm9vdGVyOiB7XG4gICAgICAgICAgICAgIGNvcHlyaWdodDogYENvcHlyaWdodCBcdTAwQTkgMjAyMC0ke25ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKX0gSWdvdXJkYCxcbiAgICAgIG1lc3NhZ2U6ICdSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuJyxcbiAgICB9LFxuICAgIGxhbmdNZW51TGFiZWw6ICdMYW5ndWFnZScsXG4gICAgbGFzdFVwZGF0ZWQ6IHtcbiAgICAgIGZvcm1hdE9wdGlvbnM6IHtcbiAgICAgICAgZGF0ZVN0eWxlOiAnc2hvcnQnLFxuICAgICAgICB0aW1lU3R5bGU6ICdtZWRpdW0nLFxuICAgICAgfSxcbiAgICAgIHRleHQ6ICdMYXN0IHVwZGF0ZWQgb24nLFxuICAgIH0sXG4gICAgbGlnaHRNb2RlU3dpdGNoVGl0bGU6ICdTd2l0Y2ggdG8gTGlnaHQgTW9kZScsXG4gICAgbmF2OiBuYXYoKSxcbiAgICBvdXRsaW5lOiB7XG4gICAgICBsYWJlbDogJ05hdmlnYXRlJyxcbiAgICB9LFxuICAgIHJldHVyblRvVG9wTGFiZWw6ICdCYWNrIHRvIHRvcCcsXG4gICAgc2lkZWJhcjoge1xuICAgICAgJy9lbi9jb21tZXJjaWFsLyc6IHtcbiAgICAgICAgYmFzZTogJy9lbi9jb21tZXJjaWFsLycsXG4gICAgICAgIGl0ZW1zOiBzaWRlYmFyQ29tbWVyY2lhbCgpLFxuICAgICAgfSxcbiAgICAgICcvZW4vZ3VpZGUvJzogeyBiYXNlOiAnL2VuL2d1aWRlLycsIGl0ZW1zOiBzaWRlYmFyR3VpZGUoKSB9LFxuICAgIH0sXG4gIH0sXG59KTtcblxuZnVuY3Rpb24gc2lkZWJhckd1aWRlKCk6IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbVtdIHtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgdGV4dDogJ0ludHJvZHVjdGlvbicsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsaW5rOiAnaW50cm9kdWN0aW9uL2lnb3VyZCcsXG4gICAgICAgIHRleHQ6ICdBYm91dCBJZ291cmQgQWRtaW4nLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGluazogJ2ludHJvZHVjdGlvbi93aHknLFxuICAgICAgICAgIHRleHQ6ICdXaHkgQ2hvb3NlIFVzPycsXG4gICAgICAgIH0sXG4gICAgICAgIHsgbGluazogJ2ludHJvZHVjdGlvbi9xdWljay1zdGFydCcsIHRleHQ6ICdRdWljayBTdGFydCcgfSxcbiAgICAgICAgeyBsaW5rOiAnaW50cm9kdWN0aW9uL3RoaW4nLCB0ZXh0OiAnTGl0ZSBWZXJzaW9uJyB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdCYXNpY3MnLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBsaW5rOiAnZXNzZW50aWFscy9jb25jZXB0JywgdGV4dDogJ0Jhc2ljIENvbmNlcHRzJyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL2RldmVsb3BtZW50JywgdGV4dDogJ0xvY2FsIERldmVsb3BtZW50JyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL3JvdXRlJywgdGV4dDogJ1JvdXRpbmcgYW5kIE1lbnUnIH0sXG4gICAgICAgIHsgbGluazogJ2Vzc2VudGlhbHMvc2V0dGluZ3MnLCB0ZXh0OiAnQ29uZmlndXJhdGlvbicgfSxcbiAgICAgICAgeyBsaW5rOiAnZXNzZW50aWFscy9pY29ucycsIHRleHQ6ICdJY29ucycgfSxcbiAgICAgICAgeyBsaW5rOiAnZXNzZW50aWFscy9zdHlsZXMnLCB0ZXh0OiAnU3R5bGVzJyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL2V4dGVybmFsLW1vZHVsZScsIHRleHQ6ICdFeHRlcm5hbCBNb2R1bGVzJyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL2J1aWxkJywgdGV4dDogJ0J1aWxkIGFuZCBEZXBsb3ltZW50JyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL3NlcnZlcicsIHRleHQ6ICdTZXJ2ZXIgSW50ZXJhY3Rpb24gYW5kIERhdGEgTW9jaycgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnQWR2YW5jZWQnLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBsaW5rOiAnaW4tZGVwdGgvbG9naW4nLCB0ZXh0OiAnTG9naW4nIH0sXG4gICAgICAgIHsgbGluazogJ2luLWRlcHRoL3RoZW1lJywgdGV4dDogJ1RoZW1lJyB9LFxuICAgICAgICB7IGxpbms6ICdpbi1kZXB0aC9hY2Nlc3MnLCB0ZXh0OiAnQWNjZXNzIENvbnRyb2wnIH0sXG4gICAgICAgIHsgbGluazogJ2luLWRlcHRoL2xvY2FsZScsIHRleHQ6ICdJbnRlcm5hdGlvbmFsaXphdGlvbicgfSxcbiAgICAgICAgeyBsaW5rOiAnaW4tZGVwdGgvZmVhdHVyZXMnLCB0ZXh0OiAnQ29tbW9uIEZlYXR1cmVzJyB9LFxuICAgICAgICB7IGxpbms6ICdpbi1kZXB0aC9jaGVjay11cGRhdGVzJywgdGV4dDogJ0NoZWNrIFVwZGF0ZXMnIH0sXG4gICAgICAgIHsgbGluazogJ2luLWRlcHRoL2xvYWRpbmcnLCB0ZXh0OiAnR2xvYmFsIExvYWRpbmcnIH0sXG4gICAgICAgIHsgbGluazogJ2luLWRlcHRoL3VpLWZyYW1ld29yaycsIHRleHQ6ICdVSSBGcmFtZXdvcmsgU3dpdGNoaW5nJyB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdFbmdpbmVlcmluZycsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IGxpbms6ICdwcm9qZWN0L3N0YW5kYXJkJywgdGV4dDogJ1N0YW5kYXJkcycgfSxcbiAgICAgICAgeyBsaW5rOiAncHJvamVjdC9jbGknLCB0ZXh0OiAnQ0xJJyB9LFxuICAgICAgICB7IGxpbms6ICdwcm9qZWN0L2RpcicsIHRleHQ6ICdEaXJlY3RvcnkgRXhwbGFuYXRpb24nIH0sXG4gICAgICAgIHsgbGluazogJ3Byb2plY3QvdGVzdCcsIHRleHQ6ICdVbml0IFRlc3RpbmcnIH0sXG4gICAgICAgIHsgbGluazogJ3Byb2plY3QvdGFpbHdpbmRjc3MnLCB0ZXh0OiAnVGFpbHdpbmQgQ1NTJyB9LFxuICAgICAgICB7IGxpbms6ICdwcm9qZWN0L2NoYW5nZXNldCcsIHRleHQ6ICdDaGFuZ2VzZXQnIH0sXG4gICAgICAgIHsgbGluazogJ3Byb2plY3Qvdml0ZScsIHRleHQ6ICdWaXRlIENvbmZpZycgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnT3RoZXJzJyxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgbGluazogJ290aGVyL3Byb2plY3QtdXBkYXRlJywgdGV4dDogJ1Byb2plY3QgVXBkYXRlJyB9LFxuICAgICAgICB7IGxpbms6ICdvdGhlci9yZW1vdmUtY29kZScsIHRleHQ6ICdSZW1vdmUgQ29kZScgfSxcbiAgICAgICAgeyBsaW5rOiAnb3RoZXIvZmFxJywgdGV4dDogJ0ZBUScgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXTtcbn1cblxuZnVuY3Rpb24gc2lkZWJhckNvbW1lcmNpYWwoKTogRGVmYXVsdFRoZW1lLlNpZGViYXJJdGVtW10ge1xuICByZXR1cm4gW1xuICAgIHtcbiAgICAgIGxpbms6ICdjb21tdW5pdHknLFxuICAgICAgdGV4dDogJ0NvbW11bml0eScsXG4gICAgfSxcbiAgICB7XG4gICAgICBsaW5rOiAndGVjaG5pY2FsLXN1cHBvcnQnLFxuICAgICAgdGV4dDogJ1RlY2huaWNhbC1zdXBwb3J0JyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGxpbms6ICdjdXN0b21pemVkJyxcbiAgICAgIHRleHQ6ICdDdXN0b21pemVkJyxcbiAgICB9LFxuICBdO1xufVxuXG5mdW5jdGlvbiBuYXYoKTogRGVmYXVsdFRoZW1lLk5hdkl0ZW1bXSB7XG4gIHJldHVybiBbXG4gICAge1xuICAgICAgYWN0aXZlTWF0Y2g6ICdeL2VuLyhndWlkZXxjb21wb25lbnRzKS8nLFxuICAgICAgdGV4dDogJ0RvYycsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7XG4gICAgICAgICAgYWN0aXZlTWF0Y2g6ICdeL2VuL2d1aWRlLycsXG4gICAgICAgICAgbGluazogJy9lbi9ndWlkZS9pbnRyb2R1Y3Rpb24vaWdvdXJkJyxcbiAgICAgICAgICB0ZXh0OiAnR3VpZGUnLFxuICAgICAgICB9LFxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgYWN0aXZlTWF0Y2g6ICdeL2VuL2NvbXBvbmVudHMvJyxcbiAgICAgICAgLy8gICBsaW5rOiAnL2VuL2NvbXBvbmVudHMvaW50cm9kdWN0aW9uJyxcbiAgICAgICAgLy8gICB0ZXh0OiAnQ29tcG9uZW50cycsXG4gICAgICAgIC8vIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnSGlzdG9yaWNhbCBWZXJzaW9ucycsXG4gICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vZG9jLnZ2YmluLmNuJyxcbiAgICAgICAgICAgICAgdGV4dDogJzIueCBWZXJzaW9uIERvY3VtZW50YXRpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdEZW1vJyxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnSWdvdXJkIEFkbWluJyxcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vd3d3Lmlnb3VyZC5wcm8nLFxuICAgICAgICAgICAgICB0ZXh0OiAnRGVtbyBWZXJzaW9uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9hbnQuaWdvdXJkLnBybycsXG4gICAgICAgICAgICAgIHRleHQ6ICdBbnQgRGVzaWduIFZ1ZSBWZXJzaW9uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9uYWl2ZS5pZ291cmQucHJvJyxcbiAgICAgICAgICAgICAgdGV4dDogJ05haXZlIFZlcnNpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICdodHRwczovL2VsZS5pZ291cmQucHJvJyxcbiAgICAgICAgICAgICAgdGV4dDogJ0VsZW1lbnQgUGx1cyBWZXJzaW9uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6ICdPdGhlcnMnLFxuICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9pZ291cmQudnZiaW4uY24nLFxuICAgICAgICAgICAgICAgIHRleHQ6ICdJZ291cmQgQWRtaW4gMi54JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiB2ZXJzaW9uLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2lnb3VyZGpzL3Z1ZS1pZ291cmQtYWRtaW4vcmVsZWFzZXMnLFxuICAgICAgICAgIHRleHQ6ICdDaGFuZ2Vsb2cnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vb3Jncy9pZ291cmRqcy9wcm9qZWN0cy81JyxcbiAgICAgICAgICB0ZXh0OiAnUm9hZG1hcCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS9pZ291cmRqcy92dWUtaWdvdXJkLWFkbWluL2Jsb2IvbWFpbi8uZ2l0aHViL2NvbnRyaWJ1dGluZy5tZCcsXG4gICAgICAgICAgdGV4dDogJ0NvbnRyaWJ1dGlvbicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgbGluazogJy9jb21tZXJjaWFsL3RlY2huaWNhbC1zdXBwb3J0JyxcbiAgICAgIHRleHQ6ICdcdUQ4M0VcdUREODQgVGVjaCBTdXBwb3J0JyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGxpbms6ICcvc3BvbnNvci9wZXJzb25hbCcsXG4gICAgICB0ZXh0OiAnXHUyNzI4IFNwb25zb3InLFxuICAgIH0sXG4gICAge1xuICAgICAgbGluazogJy9jb21tZXJjaWFsL2NvbW11bml0eScsXG4gICAgICB0ZXh0OiAnXHVEODNEXHVEQzY4XHUyMDBEXHVEODNEXHVEQzY2XHUyMDBEXHVEODNEXHVEQzY2IENvbW11bml0eScsXG4gICAgfSxcbiAgICAvLyB7XG4gICAgLy8gICBsaW5rOiAnL2ZyaWVuZC1saW5rcy8nLFxuICAgIC8vICAgdGV4dDogJ1x1RDgzRVx1REQxRCBGcmllbmQgTGlua3MnLFxuICAgIC8vIH0sXG4gIF07XG59XG4iLCAie1xuICBcIm5hbWVcIjogXCJpZ291cmQtYWRtaW4tbW9ub3JlcG9cIixcbiAgXCJ2ZXJzaW9uXCI6IFwiNS42LjItYmV0YS4xMFwiLFxuICBcInByaXZhdGVcIjogdHJ1ZSxcbiAgXCJrZXl3b3Jkc1wiOiBbXG4gICAgXCJtb25vcmVwb1wiLFxuICAgIFwidHVyYm9cIixcbiAgICBcImlnb3VyZFwiLFxuICAgIFwiaWdvdXJkIGFkbWluXCIsXG4gICAgXCJpZ291cmQgcHJvXCIsXG4gICAgXCJ2dWVcIixcbiAgICBcInZ1ZSBhZG1pblwiLFxuICAgIFwidnVlIGlnb3VyZCBhZG1pblwiLFxuICAgIFwidnVlIGlnb3VyZCBhZG1pbiBwcm9cIixcbiAgICBcInZ1ZTNcIlxuICBdLFxuICBcImxpY2Vuc2VcIjogXCJVTkxJQ0VOU0VEXCIsXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJpZ291cmRcIixcbiAgICBcImVtYWlsXCI6IFwiYW5uLmlnb3VyZEBnbWFpbC5jb21cIixcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9hbm5jd2JcIlxuICB9LFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwiY3Jvc3MtZW52IE5PREVfT1BUSU9OUz0tLW1heC1vbGQtc3BhY2Utc2l6ZT04MTkyIHR1cmJvIGJ1aWxkXCIsXG4gICAgXCJidWlsZDphbmFseXplXCI6IFwidHVyYm8gYnVpbGQ6YW5hbHl6ZVwiLFxuICAgIFwiYnVpbGQ6ZG9ja2VyXCI6IFwiLi9zY3JpcHRzL2RlcGxveS9idWlsZC1sb2NhbC1kb2NrZXItaW1hZ2Uuc2hcIixcbiAgICBcImJ1aWxkOmRvY3NcIjogXCJwbnBtIHJ1biBidWlsZCAtLWZpbHRlcj1AaWdvdXJkL2RvY3NcIixcbiAgICBcImJ1aWxkOmVsZVwiOiBcInBucG0gcnVuIGJ1aWxkIC0tZmlsdGVyPUBpZ291cmQvd2ViLWVsZVwiLFxuICAgIFwiYnVpbGQ6bmFpdmVcIjogXCJwbnBtIHJ1biBidWlsZCAtLWZpbHRlcj1AaWdvdXJkL3dlYi1uYWl2ZVwiLFxuICAgIFwiYnVpbGQ6cGxheVwiOiBcInBucG0gcnVuIGJ1aWxkIC0tZmlsdGVyPUBpZ291cmQvcGxheWdyb3VuZFwiLFxuICAgIFwiY2hhbmdlc2V0XCI6IFwicG5wbSBleGVjIGNoYW5nZXNldFwiLFxuICAgIFwiY2hlY2tcIjogXCJwbnBtIHJ1biBjaGVjazpjaXJjdWxhciAmJiBwbnBtIHJ1biBjaGVjazpkZXAgJiYgcG5wbSBydW4gY2hlY2s6dHlwZSAmJiBwbnBtIGNoZWNrOmNzcGVsbFwiLFxuICAgIFwiY2hlY2s6Y2lyY3VsYXJcIjogXCJ2c2ggY2hlY2stY2lyY3VsYXJcIixcbiAgICBcImNoZWNrOmNzcGVsbFwiOiBcImNzcGVsbCBsaW50ICoqLyoudHMgKiovUkVBRE1FLm1kIC5jaGFuZ2VzZXQvKi5tZCAtLW5vLXByb2dyZXNzXCIsXG4gICAgXCJjaGVjazpkZXBcIjogXCJ2c2ggY2hlY2stZGVwXCIsXG4gICAgXCJjaGVjazp0eXBlXCI6IFwidHVyYm8gcnVuIHR5cGVjaGVja1wiLFxuICAgIFwiY2xlYW5cIjogXCJub2RlIC4vc2NyaXB0cy9jbGVhbi5tanNcIixcbiAgICBcImNvbW1pdFwiOiBcImN6Z1wiLFxuICAgIFwiZGV2XCI6IFwidHVyYm8tcnVuIGRldlwiLFxuICAgIFwiZGV2OmFudGRcIjogXCJwbnBtIC1GIEBpZ291cmQvd2ViLWFudGQgcnVuIGRldlwiLFxuICAgIFwiZGV2OmRvY3NcIjogXCJwbnBtIC1GIEBpZ291cmQvZG9jcyBydW4gZGV2XCIsXG4gICAgXCJkZXY6ZWxlXCI6IFwicG5wbSAtRiBAaWdvdXJkL3dlYi1lbGUgcnVuIGRldlwiLFxuICAgIFwiZGV2Om5haXZlXCI6IFwicG5wbSAtRiBAaWdvdXJkL3dlYi1uYWl2ZSBydW4gZGV2XCIsXG4gICAgXCJkZXY6cGxheVwiOiBcInBucG0gLUYgQGlnb3VyZC9wbGF5Z3JvdW5kIHJ1biBkZXZcIixcbiAgICBcImZvcm1hdFwiOiBcInZzaCBsaW50IC0tZm9ybWF0XCIsXG4gICAgXCJsaW50XCI6IFwidnNoIGxpbnRcIixcbiAgICBcInBvc3RpbnN0YWxsXCI6IFwicG5wbSAtciBydW4gc3R1YlwiLFxuICAgIFwicHJlaW5zdGFsbFwiOiBcIm5weCBvbmx5LWFsbG93IHBucG1cIixcbiAgICBcInByZXZpZXdcIjogXCJ0dXJiby1ydW4gcHJldmlld1wiLFxuICAgIFwicHVibGludFwiOiBcInZzaCBwdWJsaW50XCIsXG4gICAgXCJyZWluc3RhbGxcIjogXCJwbnBtIGNsZWFuIC0tZGVsLWxvY2sgJiYgcG5wbSBpbnN0YWxsXCIsXG4gICAgXCJ0ZXN0OnVuaXRcIjogXCJ2aXRlc3QgcnVuIC0tZG9tXCIsXG4gICAgXCJ0ZXN0OmUyZVwiOiBcInR1cmJvIHJ1biB0ZXN0OmUyZVwiLFxuICAgIFwidXBkYXRlOmRlcHNcIjogXCJucHggdGF6ZSAtciAtd1wiLFxuICAgIFwidmVyc2lvblwiOiBcInBucG0gZXhlYyBjaGFuZ2VzZXQgdmVyc2lvbiAmJiBwbnBtIGluc3RhbGwgLS1uby1mcm96ZW4tbG9ja2ZpbGVcIixcbiAgICBcImNhdGFsb2dcIjogXCJwbnB4IGNvZGVtb2QgcG5wbS9jYXRhbG9nXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGNoYW5nZXNldHMvY2hhbmdlbG9nLWdpdGh1YlwiOiBcImNhdGFsb2c6XCIsXG4gICAgXCJAY2hhbmdlc2V0cy9jbGlcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwiQGlnb3VyZC9jb21taXRsaW50LWNvbmZpZ1wiOiBcIndvcmtzcGFjZTpeXCIsXG4gICAgXCJAaWdvdXJkL2VzbGludC1jb25maWdcIjogXCJ3b3Jrc3BhY2U6XlwiLFxuICAgIFwiQGlnb3VyZC9wcmV0dGllci1jb25maWdcIjogXCJ3b3Jrc3BhY2U6XlwiLFxuICAgIFwiQGlnb3VyZC9zdHlsZWxpbnQtY29uZmlnXCI6IFwid29ya3NwYWNlOl5cIixcbiAgICBcIkBpZ291cmQvdGFpbHdpbmQtY29uZmlnXCI6IFwid29ya3NwYWNlOl5cIixcbiAgICBcIkBpZ291cmQvdHNjb25maWdcIjogXCJ3b3Jrc3BhY2U6XlwiLFxuICAgIFwiQGlnb3VyZC90dXJiby1ydW5cIjogXCJ3b3Jrc3BhY2U6XlwiLFxuICAgIFwiQGlnb3VyZC92aXRlLWNvbmZpZ1wiOiBcIndvcmtzcGFjZTpeXCIsXG4gICAgXCJAaWdvdXJkL3ZzaFwiOiBcIndvcmtzcGFjZTpeXCIsXG4gICAgXCJAcGxheXdyaWdodC90ZXN0XCI6IFwiY2F0YWxvZzpcIixcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiY2F0YWxvZzpcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiOiBcImNhdGFsb2c6XCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI6IFwiY2F0YWxvZzpcIixcbiAgICBcIkB2dWUvdGVzdC11dGlsc1wiOiBcImNhdGFsb2c6XCIsXG4gICAgXCJhdXRvcHJlZml4ZXJcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwiY3Jvc3MtZW52XCI6IFwiY2F0YWxvZzpcIixcbiAgICBcImNzcGVsbFwiOiBcImNhdGFsb2c6XCIsXG4gICAgXCJoYXBweS1kb21cIjogXCJjYXRhbG9nOlwiLFxuICAgIFwiaXMtY2lcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwibGVmdGhvb2tcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwicGxheXdyaWdodFwiOiBcImNhdGFsb2c6XCIsXG4gICAgXCJyaW1yYWZcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwidGFpbHdpbmRjc3NcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwidHVyYm9cIjogXCJjYXRhbG9nOlwiLFxuICAgIFwidHlwZXNjcmlwdFwiOiBcImNhdGFsb2c6XCIsXG4gICAgXCJ1bmJ1aWxkXCI6IFwiY2F0YWxvZzpcIixcbiAgICBcInZpdGVcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwidml0ZXN0XCI6IFwiY2F0YWxvZzpcIixcbiAgICBcInZ1ZVwiOiBcImNhdGFsb2c6XCIsXG4gICAgXCJ2dWUtc2ZjLXRyYW5zZm9ybWVyXCI6IFwiXjAuMS4xNlwiLFxuICAgIFwidnVlLXRzY1wiOiBcImNhdGFsb2c6XCJcbiAgfSxcbiAgXCJlbmdpbmVzXCI6IHtcbiAgICBcIm5vZGVcIjogXCI+PTIwLjEwLjBcIixcbiAgICBcInBucG1cIjogXCI+PTkuMTIuMFwiXG4gIH0sXG4gIFwicGFja2FnZU1hbmFnZXJcIjogXCJwbnBtQDEwLjE0LjBcIixcbiAgXCJwbnBtXCI6IHtcbiAgICBcInBlZXJEZXBlbmRlbmN5UnVsZXNcIjoge1xuICAgICAgXCJhbGxvd2VkVmVyc2lvbnNcIjoge1xuICAgICAgICBcImVzbGludFwiOiBcIipcIlxuICAgICAgfVxuICAgIH0sXG4gICAgXCJvdmVycmlkZXNcIjoge1xuICAgICAgXCJAYXN0LWdyZXAvbmFwaVwiOiBcImNhdGFsb2c6XCIsXG4gICAgICBcIkBjdHJsL3Rpbnljb2xvclwiOiBcImNhdGFsb2c6XCIsXG4gICAgICBcImNsc3hcIjogXCJjYXRhbG9nOlwiLFxuICAgICAgXCJlc2J1aWxkXCI6IFwiMC4yNS4zXCIsXG4gICAgICBcInBpbmlhXCI6IFwiY2F0YWxvZzpcIixcbiAgICAgIFwidnVlXCI6IFwiY2F0YWxvZzpcIlxuICAgIH0sXG4gICAgXCJuZXZlckJ1aWx0RGVwZW5kZW5jaWVzXCI6IFtcbiAgICAgIFwiY2FudmFzXCIsXG4gICAgICBcIm5vZGUtZ3lwXCJcbiAgICBdXG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcY29kZXNcXFxcaWdvdXJkLXNoYXJlZFxcXFxkb2NzXFxcXC52aXRlcHJlc3NcXFxcY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjb2Rlc1xcXFxpZ291cmQtc2hhcmVkXFxcXGRvY3NcXFxcLnZpdGVwcmVzc1xcXFxjb25maWdcXFxcc2hhcmVkLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovY29kZXMvaWdvdXJkLXNoYXJlZC9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3NoYXJlZC5tdHNcIjtpbXBvcnQgdHlwZSB7IFB3YU9wdGlvbnMgfSBmcm9tICdAdml0ZS1wd2Evdml0ZXByZXNzJztcbmltcG9ydCB0eXBlIHsgSGVhZENvbmZpZyB9IGZyb20gJ3ZpdGVwcmVzcyc7XG5cbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnO1xuXG5pbXBvcnQge1xuICB2aXRlQXJjaGl2ZXJQbHVnaW4sXG4gIHZpdGVWeGVUYWJsZUltcG9ydHNQbHVnaW4sXG59IGZyb20gJ0BpZ291cmQvdml0ZS1jb25maWcnO1xuXG5pbXBvcnQge1xuICBHaXRDaGFuZ2Vsb2csXG4gIEdpdENoYW5nZWxvZ01hcmtkb3duU2VjdGlvbixcbn0gZnJvbSAnQG5vbGViYXNlL3ZpdGVwcmVzcy1wbHVnaW4tZ2l0LWNoYW5nZWxvZy92aXRlJztcbmltcG9ydCB0YWlsd2luZCBmcm9tICd0YWlsd2luZGNzcyc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIHBvc3Rjc3NJc29sYXRlU3R5bGVzIH0gZnJvbSAndml0ZXByZXNzJztcbmltcG9ydCB7XG4gIGdyb3VwSWNvbk1kUGx1Z2luLFxuICBncm91cEljb25WaXRlUGx1Z2luLFxufSBmcm9tICd2aXRlcHJlc3MtcGx1Z2luLWdyb3VwLWljb25zJztcblxuaW1wb3J0IHsgZGVtb1ByZXZpZXdQbHVnaW4gfSBmcm9tICcuL3BsdWdpbnMvZGVtby1wcmV2aWV3JztcbmltcG9ydCB7IHNlYXJjaCBhcyB6aFNlYXJjaCB9IGZyb20gJy4vemgubXRzJztcblxuZXhwb3J0IGNvbnN0IHNoYXJlZCA9IGRlZmluZUNvbmZpZyh7XG4gIGFwcGVhcmFuY2U6ICdkYXJrJyxcbiAgaGVhZDogaGVhZCgpLFxuICBtYXJrZG93bjoge1xuICAgIHByZUNvbmZpZyhtZCkge1xuICAgICAgbWQudXNlKGRlbW9QcmV2aWV3UGx1Z2luKTtcbiAgICAgIG1kLnVzZShncm91cEljb25NZFBsdWdpbik7XG4gICAgfSxcbiAgfSxcbiAgcHdhOiBwd2EoKSxcbiAgc3JjRGlyOiAnc3JjJyxcbiAgdGhlbWVDb25maWc6IHtcbiAgICBpMThuUm91dGluZzogdHJ1ZSxcbiAgICBsb2dvOiAnaHR0cHM6Ly91bnBrZy5jb20vQGlnb3VyZGpzL3N0YXRpYy1zb3VyY2VAMC4xLjcvc291cmNlL2xvZ28tdjEud2VicCcsXG4gICAgc2VhcmNoOiB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGxvY2FsZXM6IHtcbiAgICAgICAgICAuLi56aFNlYXJjaCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwcm92aWRlcjogJ2xvY2FsJyxcbiAgICB9LFxuICAgIHNpdGVUaXRsZTogJ0lnb3VyZCBBZG1pbicsXG4gICAgc29jaWFsTGlua3M6IFtcbiAgICAgICAgICAgICAgeyBpY29uOiAnZ2l0aHViJywgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS9pZ291cmRqcy92dWUtaWdvdXJkLWFkbWluJyB9LFxuICAgIF0sXG4gIH0sXG4gICAgICAgIHRpdGxlOiAnSWdvdXJkIEFkbWluJyxcbiAgdml0ZToge1xuICAgIGJ1aWxkOiB7XG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IEluZmluaXR5LFxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgdGFpbHdpbmQoKSxcbiAgICAgICAgICBwb3N0Y3NzSXNvbGF0ZVN0eWxlcyh7IGluY2x1ZGVGaWxlczogWy92cC1kb2NcXC5jc3MvXSB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhcGk6ICdtb2Rlcm4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIGpzb246IHtcbiAgICAgIHN0cmluZ2lmeTogdHJ1ZSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIEdpdENoYW5nZWxvZyh7XG4gICAgICAgIG1hcEF1dGhvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBtYXBCeU5hbWVBbGlhc2VzOiBbJ0lnb3VyZCddLFxuICAgICAgbmFtZTogJ2lnb3VyZCcsXG4gICAgICAgICAgICB1c2VybmFtZTogJ2FubmN3YicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAndmluY2UnLFxuICAgICAgICAgICAgdXNlcm5hbWU6ICd2aW5jZTI5MjAwNycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnTGkgS3VpJyxcbiAgICAgICAgICAgIHVzZXJuYW1lOiAnbGlrdWk2MjgnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHJlcG9VUkw6ICgpID0+ICdodHRwczovL2dpdGh1Yi5jb20vaWdvdXJkanMvdnVlLWlnb3VyZC1hZG1pbicsXG4gICAgICB9KSxcbiAgICAgIEdpdENoYW5nZWxvZ01hcmtkb3duU2VjdGlvbigpLFxuICAgICAgdml0ZUFyY2hpdmVyUGx1Z2luKHsgb3V0cHV0RGlyOiAnLnZpdGVwcmVzcycgfSksXG4gICAgICBncm91cEljb25WaXRlUGx1Z2luKCksXG4gICAgICBhd2FpdCB2aXRlVnhlVGFibGVJbXBvcnRzUGx1Z2luKCksXG4gICAgXSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGZzOiB7XG4gICAgICAgIGFsbG93OiBbJy4uLy4uJ10sXG4gICAgICB9LFxuICAgICAgaG9zdDogdHJ1ZSxcbiAgICAgIHBvcnQ6IDYxNzMsXG4gICAgfSxcblxuICAgIHNzcjoge1xuICAgICAgZXh0ZXJuYWw6IFsnQHZ1ZS9yZXBsJ10sXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5mdW5jdGlvbiBoZWFkKCk6IEhlYWRDb25maWdbXSB7XG4gIHJldHVybiBbXG4gICAgICAgICAgICBbJ21ldGEnLCB7IGNvbnRlbnQ6ICdJZ291cmRqcyBUZWFtJywgbmFtZTogJ2F1dGhvcicgfV0sXG4gICAgW1xuICAgICAgJ21ldGEnLFxuICAgICAge1xuICAgICAgICBjb250ZW50OiAnaWdvdXJkLCB2aXRlanMsIHZpdGUsIHNoYWNkbi11aSwgdnVlJyxcbiAgICAgICAgbmFtZTogJ2tleXdvcmRzJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBbJ2xpbmsnLCB7IGhyZWY6ICcvZmF2aWNvbi5pY28nLCByZWw6ICdpY29uJywgdHlwZTogJ2ltYWdlL3N2Zyt4bWwnIH1dLFxuICAgIFtcbiAgICAgICdtZXRhJyxcbiAgICAgIHtcbiAgICAgICAgY29udGVudDpcbiAgICAgICAgICAnd2lkdGg9ZGV2aWNlLXdpZHRoLGluaXRpYWwtc2NhbGU9MSxtaW5pbXVtLXNjYWxlPTEuMCxtYXhpbXVtLXNjYWxlPTEuMCx1c2VyLXNjYWxhYmxlPW5vJyxcbiAgICAgICAgbmFtZTogJ3ZpZXdwb3J0JyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBbJ21ldGEnLCB7IGNvbnRlbnQ6ICdpZ291cmQgYWRtaW4gZG9jcycsIG5hbWU6ICdrZXl3b3JkcycgfV0sXG4gICAgWydsaW5rJywgeyBocmVmOiAnL2Zhdmljb24uaWNvJywgcmVsOiAnaWNvbicgfV0sXG4gICAgLy8gW1xuICAgIC8vICAgJ3NjcmlwdCcsXG4gICAgLy8gICB7XG4gICAgLy8gICAgIHNyYzogJ2h0dHBzOi8vY2RuLnRhaWx3aW5kY3NzLmNvbScsXG4gICAgLy8gICB9LFxuICAgIC8vIF0sXG4gIF07XG59XG5cbmZ1bmN0aW9uIHB3YSgpOiBQd2FPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICBpbmNsdWRlTWFuaWZlc3RJY29uczogZmFsc2UsXG4gICAgbWFuaWZlc3Q6IHtcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnSWdvdXJkIEFkbWluIGlzIGEgbW9kZXJuIGFkbWluIGRhc2hib2FyZCB0ZW1wbGF0ZSBiYXNlZCBvbiBWdWUgMy4gJyxcbiAgICAgIGljb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgIHNyYzogJ2h0dHBzOi8vdW5wa2cuY29tL0BpZ291cmRqcy9zdGF0aWMtc291cmNlQDAuMS43L3NvdXJjZS9wd2EtaWNvbi0xOTIucG5nJyxcbiAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgc3JjOiAnaHR0cHM6Ly91bnBrZy5jb20vQGlnb3VyZGpzL3N0YXRpYy1zb3VyY2VAMC4xLjcvc291cmNlL3B3YS1pY29uLTUxMi5wbmcnLFxuICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGlkOiAnLycsXG4gICAgICBuYW1lOiAnSWdvdXJkIEFkbWluIERvYycsXG4gICAgICBzaG9ydF9uYW1lOiAnaWdvdXJkX2FkbWluX2RvYycsXG4gICAgICB0aGVtZV9jb2xvcjogJyNmZmZmZmYnLFxuICAgIH0sXG4gICAgb3V0RGlyOiByZXNvbHZlKHByb2Nlc3MuY3dkKCksICcudml0ZXByZXNzL2Rpc3QnKSxcbiAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICB3b3JrYm94OiB7XG4gICAgICBnbG9iUGF0dGVybnM6IFsnKiovKi57Y3NzLGpzLGh0bWwsc3ZnLHBuZyxpY28sdHh0LHdvZmYyfSddLFxuICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDUgKiAxMDI0ICogMTAyNCxcbiAgICB9LFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjb2Rlc1xcXFxpZ291cmQtc2hhcmVkXFxcXGRvY3NcXFxcLnZpdGVwcmVzc1xcXFxjb25maWdcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcY29kZXNcXFxcaWdvdXJkLXNoYXJlZFxcXFxkb2NzXFxcXC52aXRlcHJlc3NcXFxcY29uZmlnXFxcXHBsdWdpbnNcXFxcZGVtby1wcmV2aWV3LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9jb2Rlcy9pZ291cmQtc2hhcmVkL2RvY3MvLnZpdGVwcmVzcy9jb25maWcvcGx1Z2lucy9kZW1vLXByZXZpZXcudHNcIjtpbXBvcnQgdHlwZSB7IE1hcmtkb3duRW52LCBNYXJrZG93blJlbmRlcmVyIH0gZnJvbSAndml0ZXByZXNzJztcblxuaW1wb3J0IGNyeXB0byBmcm9tICdub2RlOmNyeXB0byc7XG5pbXBvcnQgeyByZWFkZGlyU3luYyB9IGZyb20gJ25vZGU6ZnMnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ25vZGU6cGF0aCc7XG5cbmV4cG9ydCBjb25zdCByYXdQYXRoUmVnZXhwID1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlZ2V4cC9uby1zdXBlci1saW5lYXItYmFja3RyYWNraW5nLCByZWdleHAvc3RyaWN0XG4gIC9eKC4rPyg/OlxcLihbXFxkYS16XSspKT8pKCNbXFx3LV0rKT8oPzogP3soXFxkKyg/OlssLV1cXGQrKSopPyA/KFxcUyspP30pPyA/KD86XFxbKC4rKV0pPyQvO1xuXG5mdW5jdGlvbiByYXdQYXRoVG9Ub2tlbihyYXdQYXRoOiBzdHJpbmcpIHtcbiAgY29uc3QgW1xuICAgIGZpbGVwYXRoID0gJycsXG4gICAgZXh0ZW5zaW9uID0gJycsXG4gICAgcmVnaW9uID0gJycsXG4gICAgbGluZXMgPSAnJyxcbiAgICBsYW5nID0gJycsXG4gICAgcmF3VGl0bGUgPSAnJyxcbiAgXSA9IChyYXdQYXRoUmVnZXhwLmV4ZWMocmF3UGF0aCkgfHwgW10pLnNsaWNlKDEpO1xuXG4gIGNvbnN0IHRpdGxlID0gcmF3VGl0bGUgfHwgZmlsZXBhdGguc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcblxuICByZXR1cm4geyBleHRlbnNpb24sIGZpbGVwYXRoLCBsYW5nLCBsaW5lcywgcmVnaW9uLCB0aXRsZSB9O1xufVxuXG5leHBvcnQgY29uc3QgZGVtb1ByZXZpZXdQbHVnaW4gPSAobWQ6IE1hcmtkb3duUmVuZGVyZXIpID0+IHtcbiAgbWQuY29yZS5ydWxlci5hZnRlcignaW5saW5lJywgJ2RlbW8tcHJldmlldycsIChzdGF0ZSkgPT4ge1xuICAgIGNvbnN0IGluc2VydENvbXBvbmVudEltcG9ydCA9IChpbXBvcnRTdHJpbmc6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSBzdGF0ZS50b2tlbnMuZmluZEluZGV4KFxuICAgICAgICAoaSkgPT4gaS50eXBlID09PSAnaHRtbF9ibG9jaycgJiYgaS5jb250ZW50Lm1hdGNoKC88c2NyaXB0IHNldHVwPi9nKSxcbiAgICAgICk7XG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIGNvbnN0IGltcG9ydENvbXBvbmVudCA9IG5ldyBzdGF0ZS5Ub2tlbignaHRtbF9ibG9jaycsICcnLCAwKTtcbiAgICAgICAgaW1wb3J0Q29tcG9uZW50LmNvbnRlbnQgPSBgPHNjcmlwdCBzZXR1cD5cXG4ke2ltcG9ydFN0cmluZ31cXG48L3NjcmlwdD5cXG5gO1xuICAgICAgICBzdGF0ZS50b2tlbnMuc3BsaWNlKDAsIDAsIGltcG9ydENvbXBvbmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3RhdGUudG9rZW5zW2luZGV4XSkge1xuICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBzdGF0ZS50b2tlbnNbaW5kZXhdLmNvbnRlbnQ7XG4gICAgICAgICAgc3RhdGUudG9rZW5zW2luZGV4XS5jb250ZW50ID0gY29udGVudC5yZXBsYWNlKFxuICAgICAgICAgICAgJzwvc2NyaXB0PicsXG4gICAgICAgICAgICBgJHtpbXBvcnRTdHJpbmd9XFxuPC9zY3JpcHQ+YCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICAvLyBEZWZpbmUgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCB0aGUgZGVzaXJlZCBwYXR0ZXJuXG4gICAgY29uc3QgcmVnZXggPSAvPERlbW9QcmV2aWV3W14+XSpcXHNkaXI9XCIoW15cIl0qKVwiL2c7XG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIHRoZSBNYXJrZG93biBjb250ZW50IGFuZCByZXBsYWNlIHRoZSBwYXR0ZXJuXG4gICAgc3RhdGUuc3JjID0gc3RhdGUuc3JjLnJlcGxhY2VBbGwocmVnZXgsIChfbWF0Y2gsIGRpcikgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50RGlyID0gam9pbihwcm9jZXNzLmN3ZCgpLCAnc3JjJywgZGlyKS5yZXBsYWNlQWxsKFxuICAgICAgICAnXFxcXCcsXG4gICAgICAgICcvJyxcbiAgICAgICk7XG5cbiAgICAgIGxldCBjaGlsZEZpbGVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgbGV0IGRpckV4aXN0cyA9IHRydWU7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNoaWxkRmlsZXMgPVxuICAgICAgICAgIHJlYWRkaXJTeW5jKGNvbXBvbmVudERpciwge1xuICAgICAgICAgICAgZW5jb2Rpbmc6ICd1dGY4JyxcbiAgICAgICAgICAgIHJlY3Vyc2l2ZTogZmFsc2UsXG4gICAgICAgICAgICB3aXRoRmlsZVR5cGVzOiBmYWxzZSxcbiAgICAgICAgICB9KSB8fCBbXTtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICBkaXJFeGlzdHMgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkaXJFeGlzdHMpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1bmlxdWVXb3JkID0gZ2VuZXJhdGVDb250ZW50SGFzaChjb21wb25lbnREaXIpO1xuXG4gICAgICBjb25zdCBDb21wb25lbnROYW1lID0gYERlbW9Db21wb25lbnRfJHt1bmlxdWVXb3JkfWA7XG4gICAgICBpbnNlcnRDb21wb25lbnRJbXBvcnQoXG4gICAgICAgIGBpbXBvcnQgJHtDb21wb25lbnROYW1lfSBmcm9tICcke2NvbXBvbmVudERpcn0vaW5kZXgudnVlJ2AsXG4gICAgICApO1xuICAgICAgY29uc3QgeyBwYXRoOiBfcGF0aCB9ID0gc3RhdGUuZW52IGFzIE1hcmtkb3duRW52O1xuXG4gICAgICBjb25zdCBpbmRleCA9IHN0YXRlLnRva2Vucy5maW5kSW5kZXgoKGkpID0+IGkuY29udGVudC5tYXRjaChyZWdleCkpO1xuXG4gICAgICBpZiAoIXN0YXRlLnRva2Vuc1tpbmRleF0pIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlyc3RTdHJpbmcgPSAnaW5kZXgudnVlJztcbiAgICAgIGNoaWxkRmlsZXMgPSBjaGlsZEZpbGVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgaWYgKGEgPT09IGZpcnN0U3RyaW5nKSByZXR1cm4gLTE7XG4gICAgICAgIGlmIChiID09PSBmaXJzdFN0cmluZykgcmV0dXJuIDE7XG4gICAgICAgIHJldHVybiBhLmxvY2FsZUNvbXBhcmUoYiwgJ2VuJywgeyBzZW5zaXRpdml0eTogJ2Jhc2UnIH0pO1xuICAgICAgfSk7XG4gICAgICBzdGF0ZS50b2tlbnNbaW5kZXhdLmNvbnRlbnQgPVxuICAgICAgICBgPERlbW9QcmV2aWV3IGZpbGVzPVwiJHtlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY2hpbGRGaWxlcykpfVwiID48JHtDb21wb25lbnROYW1lfS8+XG4gICAgICAgIGA7XG5cbiAgICAgIGNvbnN0IF9kdW1teVRva2VuID0gbmV3IHN0YXRlLlRva2VuKCcnLCAnJywgMCk7XG4gICAgICBjb25zdCB0b2tlbkFycmF5OiBBcnJheTx0eXBlb2YgX2R1bW15VG9rZW4+ID0gW107XG4gICAgICBjaGlsZEZpbGVzLmZvckVhY2goKGZpbGVuYW1lKSA9PiB7XG4gICAgICAgIC8vIGNvbnN0IHNsb3ROYW1lID0gZmlsZW5hbWUucmVwbGFjZShleHRuYW1lKGZpbGVuYW1lKSwgJycpO1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlU3RhcnQgPSBuZXcgc3RhdGUuVG9rZW4oJ2h0bWxfaW5saW5lJywgJycsIDApO1xuICAgICAgICB0ZW1wbGF0ZVN0YXJ0LmNvbnRlbnQgPSBgPHRlbXBsYXRlICMke2ZpbGVuYW1lfT5gO1xuICAgICAgICB0b2tlbkFycmF5LnB1c2godGVtcGxhdGVTdGFydCk7XG5cbiAgICAgICAgY29uc3QgcmVzb2x2ZWRQYXRoID0gam9pbihjb21wb25lbnREaXIsIGZpbGVuYW1lKTtcblxuICAgICAgICBjb25zdCB7IGV4dGVuc2lvbiwgZmlsZXBhdGgsIGxhbmcsIGxpbmVzLCB0aXRsZSB9ID1cbiAgICAgICAgICByYXdQYXRoVG9Ub2tlbihyZXNvbHZlZFBhdGgpO1xuICAgICAgICAvLyBBZGQgY29kZSB0b2tlbnMgZm9yIGVhY2ggbGluZVxuICAgICAgICBjb25zdCB0b2tlbiA9IG5ldyBzdGF0ZS5Ub2tlbignZmVuY2UnLCAnY29kZScsIDApO1xuICAgICAgICB0b2tlbi5pbmZvID0gYCR7bGFuZyB8fCBleHRlbnNpb259JHtsaW5lcyA/IGB7JHtsaW5lc319YCA6ICcnfSR7XG4gICAgICAgICAgdGl0bGUgPyBgWyR7dGl0bGV9XWAgOiAnJ1xuICAgICAgICB9YDtcblxuICAgICAgICB0b2tlbi5jb250ZW50ID0gYDw8PCAke2ZpbGVwYXRofWA7XG4gICAgICAgICh0b2tlbiBhcyBhbnkpLnNyYyA9IFtyZXNvbHZlZFBhdGhdO1xuICAgICAgICB0b2tlbkFycmF5LnB1c2godG9rZW4pO1xuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlRW5kID0gbmV3IHN0YXRlLlRva2VuKCdodG1sX2lubGluZScsICcnLCAwKTtcbiAgICAgICAgdGVtcGxhdGVFbmQuY29udGVudCA9ICc8L3RlbXBsYXRlPic7XG4gICAgICAgIHRva2VuQXJyYXkucHVzaCh0ZW1wbGF0ZUVuZCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGVuZFRhZyA9IG5ldyBzdGF0ZS5Ub2tlbignaHRtbF9pbmxpbmUnLCAnJywgMCk7XG4gICAgICBlbmRUYWcuY29udGVudCA9ICc8L0RlbW9QcmV2aWV3Pic7XG4gICAgICB0b2tlbkFycmF5LnB1c2goZW5kVGFnKTtcblxuICAgICAgc3RhdGUudG9rZW5zLnNwbGljZShpbmRleCArIDEsIDAsIC4uLnRva2VuQXJyYXkpO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZyhcbiAgICAgIC8vICAgc3RhdGUubWQucmVuZGVyZXIucmVuZGVyKHN0YXRlLnRva2Vucywgc3RhdGU/Lm9wdGlvbnMgPz8gW10sIHN0YXRlLmVudiksXG4gICAgICAvLyApO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ29udGVudEhhc2goaW5wdXQ6IHN0cmluZywgbGVuZ3RoOiBudW1iZXIgPSAxMCk6IHN0cmluZyB7XG4gIC8vIFx1NEY3Rlx1NzUyOCBTSEEtMjU2IFx1NzUxRlx1NjIxMFx1NTRDOFx1NUUwQ1x1NTAzQ1xuICBjb25zdCBoYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShpbnB1dCkuZGlnZXN0KCdoZXgnKTtcblxuICAvLyBcdTVDMDZcdTU0QzhcdTVFMENcdTUwM0NcdThGNkNcdTYzNjJcdTRFM0EgQmFzZTM2IFx1N0YxNlx1NzgwMVx1RkYwQ1x1NUU3Nlx1NTNENlx1NjMwN1x1NUI5QVx1OTU3Rlx1NUVBNlx1NzY4NFx1NUI1N1x1N0IyNlx1NEY1Q1x1NEUzQVx1N0VEM1x1Njc5Q1xuICByZXR1cm4gTnVtYmVyLnBhcnNlSW50KGhhc2gsIDE2KS50b1N0cmluZygzNikuc2xpY2UoMCwgbGVuZ3RoKTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcY29kZXNcXFxcaWdvdXJkLXNoYXJlZFxcXFxkb2NzXFxcXC52aXRlcHJlc3NcXFxcY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjb2Rlc1xcXFxpZ291cmQtc2hhcmVkXFxcXGRvY3NcXFxcLnZpdGVwcmVzc1xcXFxjb25maWdcXFxcemgubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9jb2Rlcy9pZ291cmQtc2hhcmVkL2RvY3MvLnZpdGVwcmVzcy9jb25maWcvemgubXRzXCI7aW1wb3J0IHR5cGUgeyBEZWZhdWx0VGhlbWUgfSBmcm9tICd2aXRlcHJlc3MnO1xuXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlcHJlc3MnO1xuXG5pbXBvcnQgeyB2ZXJzaW9uIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZS5qc29uJztcblxuZXhwb3J0IGNvbnN0IHpoID0gZGVmaW5lQ29uZmlnKHtcbiAgZGVzY3JpcHRpb246ICdJZ291cmQgQWRtaW4gJiBcdTRGMDFcdTRFMUFcdTdFQTdcdTdCQTFcdTc0MDZcdTdDRkJcdTdFREZcdTY4NDZcdTY3QjYnLFxuICBsYW5nOiAnemgtSGFucycsXG4gIHRoZW1lQ29uZmlnOiB7XG4gICAgZGFya01vZGVTd2l0Y2hMYWJlbDogJ1x1NEUzQlx1OTg5OCcsXG4gICAgZGFya01vZGVTd2l0Y2hUaXRsZTogJ1x1NTIwN1x1NjM2Mlx1NTIzMFx1NkRGMVx1ODI3Mlx1NkEyMVx1NUYwRicsXG4gICAgZG9jRm9vdGVyOiB7XG4gICAgICBuZXh0OiAnXHU0RTBCXHU0RTAwXHU5ODc1JyxcbiAgICAgIHByZXY6ICdcdTRFMEFcdTRFMDBcdTk4NzUnLFxuICAgIH0sXG4gICAgZWRpdExpbms6IHtcbiAgICAgIHBhdHRlcm46XG4gICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vaWdvdXJkanMvdnVlLWlnb3VyZC1hZG1pbi9lZGl0L21haW4vZG9jcy9zcmMvOnBhdGgnLFxuICAgICAgdGV4dDogJ1x1NTcyOCBHaXRIdWIgXHU0RTBBXHU3RjE2XHU4RjkxXHU2QjY0XHU5ODc1XHU5NzYyJyxcbiAgICB9LFxuICAgIGZvb3Rlcjoge1xuICAgICAgICAgICAgICBjb3B5cmlnaHQ6IGBDb3B5cmlnaHQgXHUwMEE5IDIwMjAtJHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9IElnb3VyZGAsXG4gICAgICBtZXNzYWdlOiAnXHU1N0ZBXHU0RThFIE1JVCBcdThCQjhcdTUzRUZcdTUzRDFcdTVFMDMuJyxcbiAgICB9LFxuICAgIGxhbmdNZW51TGFiZWw6ICdcdTU5MUFcdThCRURcdThBMDAnLFxuICAgIGxhc3RVcGRhdGVkOiB7XG4gICAgICBmb3JtYXRPcHRpb25zOiB7XG4gICAgICAgIGRhdGVTdHlsZTogJ3Nob3J0JyxcbiAgICAgICAgdGltZVN0eWxlOiAnbWVkaXVtJyxcbiAgICAgIH0sXG4gICAgICB0ZXh0OiAnXHU2NzAwXHU1NDBFXHU2NkY0XHU2NUIwXHU0RThFJyxcbiAgICB9LFxuICAgIGxpZ2h0TW9kZVN3aXRjaFRpdGxlOiAnXHU1MjA3XHU2MzYyXHU1MjMwXHU2RDQ1XHU4MjcyXHU2QTIxXHU1RjBGJyxcbiAgICBuYXY6IG5hdigpLFxuXG4gICAgb3V0bGluZToge1xuICAgICAgbGFiZWw6ICdcdTk4NzVcdTk3NjJcdTVCRkNcdTgyMkEnLFxuICAgIH0sXG4gICAgcmV0dXJuVG9Ub3BMYWJlbDogJ1x1NTZERVx1NTIzMFx1OTg3Nlx1OTBFOCcsXG5cbiAgICBzaWRlYmFyOiB7XG4gICAgICAnL2NvbW1lcmNpYWwvJzogeyBiYXNlOiAnL2NvbW1lcmNpYWwvJywgaXRlbXM6IHNpZGViYXJDb21tZXJjaWFsKCkgfSxcbiAgICAgICcvY29tcG9uZW50cy8nOiB7IGJhc2U6ICcvY29tcG9uZW50cy8nLCBpdGVtczogc2lkZWJhckNvbXBvbmVudHMoKSB9LFxuICAgICAgJy9ndWlkZS8nOiB7IGJhc2U6ICcvZ3VpZGUvJywgaXRlbXM6IHNpZGViYXJHdWlkZSgpIH0sXG4gICAgfSxcbiAgICBzaWRlYmFyTWVudUxhYmVsOiAnXHU4M0RDXHU1MzU1JyxcbiAgfSxcbn0pO1xuXG5mdW5jdGlvbiBzaWRlYmFyR3VpZGUoKTogRGVmYXVsdFRoZW1lLlNpZGViYXJJdGVtW10ge1xuICByZXR1cm4gW1xuICAgIHtcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICB0ZXh0OiAnXHU3QjgwXHU0RUNCJyxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGxpbms6ICdpbnRyb2R1Y3Rpb24vaWdvdXJkJyxcbiAgICAgICAgdGV4dDogJ1x1NTE3M1x1NEU4RSBJZ291cmQgQWRtaW4nLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGluazogJ2ludHJvZHVjdGlvbi93aHknLFxuICAgICAgICAgIHRleHQ6ICdcdTRFM0FcdTRFQzBcdTRFNDhcdTkwMDlcdTYyRTlcdTYyMTFcdTRFRUM/JyxcbiAgICAgICAgfSxcbiAgICAgICAgeyBsaW5rOiAnaW50cm9kdWN0aW9uL3F1aWNrLXN0YXJ0JywgdGV4dDogJ1x1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQicgfSxcbiAgICAgICAgeyBsaW5rOiAnaW50cm9kdWN0aW9uL3RoaW4nLCB0ZXh0OiAnXHU3Q0JFXHU3QjgwXHU3MjQ4XHU2NzJDJyB9LFxuICAgICAgICB7XG4gICAgICAgICAgYmFzZTogJy8nLFxuICAgICAgICAgIGxpbms6ICdjb21wb25lbnRzL2ludHJvZHVjdGlvbicsXG4gICAgICAgICAgdGV4dDogJ1x1N0VDNFx1NEVGNlx1NjU4N1x1Njg2MycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ1x1NTdGQVx1Nzg0MCcsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL2NvbmNlcHQnLCB0ZXh0OiAnXHU1N0ZBXHU3ODQwXHU2OTgyXHU1RkY1JyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL2RldmVsb3BtZW50JywgdGV4dDogJ1x1NjcyQ1x1NTczMFx1NUYwMFx1NTNEMScgfSxcbiAgICAgICAgeyBsaW5rOiAnZXNzZW50aWFscy9yb3V0ZScsIHRleHQ6ICdcdThERUZcdTc1MzFcdTU0OENcdTgzRENcdTUzNTUnIH0sXG4gICAgICAgIHsgbGluazogJ2Vzc2VudGlhbHMvc2V0dGluZ3MnLCB0ZXh0OiAnXHU5MTREXHU3RjZFJyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL2ljb25zJywgdGV4dDogJ1x1NTZGRVx1NjgwNycgfSxcbiAgICAgICAgeyBsaW5rOiAnZXNzZW50aWFscy9zdHlsZXMnLCB0ZXh0OiAnXHU2ODM3XHU1RjBGJyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL2V4dGVybmFsLW1vZHVsZScsIHRleHQ6ICdcdTU5MTZcdTkwRThcdTZBMjFcdTU3NTcnIH0sXG4gICAgICAgIHsgbGluazogJ2Vzc2VudGlhbHMvYnVpbGQnLCB0ZXh0OiAnXHU2Nzg0XHU1RUZBXHU0RTBFXHU5MEU4XHU3RjcyJyB9LFxuICAgICAgICB7IGxpbms6ICdlc3NlbnRpYWxzL3NlcnZlcicsIHRleHQ6ICdcdTY3MERcdTUyQTFcdTdBRUZcdTRFQTRcdTRFOTJcdTRFMEVcdTY1NzBcdTYzNkVNb2NrJyB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdcdTZERjFcdTUxNjUnLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBsaW5rOiAnaW4tZGVwdGgvbG9naW4nLCB0ZXh0OiAnXHU3NjdCXHU1RjU1JyB9LFxuICAgICAgICAvLyB7IGxpbms6ICdpbi1kZXB0aC9sYXlvdXQnLCB0ZXh0OiAnXHU1RTAzXHU1QzQwJyB9LFxuICAgICAgICB7IGxpbms6ICdpbi1kZXB0aC90aGVtZScsIHRleHQ6ICdcdTRFM0JcdTk4OTgnIH0sXG4gICAgICAgIHsgbGluazogJ2luLWRlcHRoL2FjY2VzcycsIHRleHQ6ICdcdTY3NDNcdTk2NTAnIH0sXG4gICAgICAgIHsgbGluazogJ2luLWRlcHRoL2xvY2FsZScsIHRleHQ6ICdcdTU2RkRcdTk2NDVcdTUzMTYnIH0sXG4gICAgICAgIHsgbGluazogJ2luLWRlcHRoL2ZlYXR1cmVzJywgdGV4dDogJ1x1NUUzOFx1NzUyOFx1NTI5Rlx1ODBGRCcgfSxcbiAgICAgICAgeyBsaW5rOiAnaW4tZGVwdGgvY2hlY2stdXBkYXRlcycsIHRleHQ6ICdcdTY4QzBcdTY3RTVcdTY2RjRcdTY1QjAnIH0sXG4gICAgICAgIHsgbGluazogJ2luLWRlcHRoL2xvYWRpbmcnLCB0ZXh0OiAnXHU1MTY4XHU1QzQwbG9hZGluZycgfSxcbiAgICAgICAgeyBsaW5rOiAnaW4tZGVwdGgvdWktZnJhbWV3b3JrJywgdGV4dDogJ1x1N0VDNFx1NEVGNlx1NUU5M1x1NTIwN1x1NjM2MicgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnXHU1REU1XHU3QTBCJyxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgbGluazogJ3Byb2plY3Qvc3RhbmRhcmQnLCB0ZXh0OiAnXHU4OUM0XHU4MzAzJyB9LFxuICAgICAgICB7IGxpbms6ICdwcm9qZWN0L2NsaScsIHRleHQ6ICdDTEknIH0sXG4gICAgICAgIHsgbGluazogJ3Byb2plY3QvZGlyJywgdGV4dDogJ1x1NzZFRVx1NUY1NVx1OEJGNFx1NjYwRScgfSxcbiAgICAgICAgeyBsaW5rOiAncHJvamVjdC90ZXN0JywgdGV4dDogJ1x1NTM1NVx1NTE0M1x1NkQ0Qlx1OEJENScgfSxcbiAgICAgICAgeyBsaW5rOiAncHJvamVjdC90YWlsd2luZGNzcycsIHRleHQ6ICdUYWlsd2luZCBDU1MnIH0sXG4gICAgICAgIHsgbGluazogJ3Byb2plY3QvY2hhbmdlc2V0JywgdGV4dDogJ0NoYW5nZXNldCcgfSxcbiAgICAgICAgeyBsaW5rOiAncHJvamVjdC92aXRlJywgdGV4dDogJ1ZpdGUgQ29uZmlnJyB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdcdTUxNzZcdTRFRDYnLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBsaW5rOiAnb3RoZXIvcHJvamVjdC11cGRhdGUnLCB0ZXh0OiAnXHU5ODc5XHU3NkVFXHU2NkY0XHU2NUIwJyB9LFxuICAgICAgICB7IGxpbms6ICdvdGhlci9yZW1vdmUtY29kZScsIHRleHQ6ICdcdTc5RkJcdTk2NjRcdTRFRTNcdTc4MDEnIH0sXG4gICAgICAgIHsgbGluazogJ290aGVyL2ZhcScsIHRleHQ6ICdcdTVFMzhcdTg5QzFcdTk1RUVcdTk4OTgnIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF07XG59XG5cbmZ1bmN0aW9uIHNpZGViYXJDb21tZXJjaWFsKCk6IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbVtdIHtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBsaW5rOiAnY29tbXVuaXR5JyxcbiAgICAgIHRleHQ6ICdcdTRFQTRcdTZENDFcdTdGQTQnLFxuICAgIH0sXG4gICAge1xuICAgICAgbGluazogJ3RlY2huaWNhbC1zdXBwb3J0JyxcbiAgICAgIHRleHQ6ICdcdTYyODBcdTY3MkZcdTY1MkZcdTYzMDEnLFxuICAgIH0sXG4gICAge1xuICAgICAgbGluazogJ2N1c3RvbWl6ZWQnLFxuICAgICAgdGV4dDogJ1x1NUI5QVx1NTIzNlx1NUYwMFx1NTNEMScsXG4gICAgfSxcbiAgXTtcbn1cblxuZnVuY3Rpb24gc2lkZWJhckNvbXBvbmVudHMoKTogRGVmYXVsdFRoZW1lLlNpZGViYXJJdGVtW10ge1xuICByZXR1cm4gW1xuICAgIHtcbiAgICAgIHRleHQ6ICdcdTdFQzRcdTRFRjYnLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdpbnRyb2R1Y3Rpb24nLFxuICAgICAgICAgIHRleHQ6ICdcdTRFQ0JcdTdFQ0QnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICB0ZXh0OiAnXHU1RTAzXHU1QzQwXHU3RUM0XHU0RUY2JyxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBsaW5rOiAnbGF5b3V0LXVpL3BhZ2UnLFxuICAgICAgICAgIHRleHQ6ICdQYWdlIFx1OTg3NVx1OTc2MicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIHRleHQ6ICdcdTkwMUFcdTc1MjhcdTdFQzRcdTRFRjYnLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdjb21tb24tdWkvaWdvdXJkLWFwaS1jb21wb25lbnQnLFxuICAgICAgICAgIHRleHQ6ICdBcGlDb21wb25lbnQgQXBpXHU3RUM0XHU0RUY2XHU1MzA1XHU4OEM1XHU1NjY4JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdjb21tb24tdWkvaWdvdXJkLWFsZXJ0JyxcbiAgICAgICAgICB0ZXh0OiAnQWxlcnQgXHU4RjdCXHU5MUNGXHU2M0QwXHU3OTNBXHU2ODQ2JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdjb21tb24tdWkvaWdvdXJkLW1vZGFsJyxcbiAgICAgICAgICB0ZXh0OiAnTW9kYWwgXHU2QTIxXHU2MDAxXHU2ODQ2JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdjb21tb24tdWkvaWdvdXJkLWRyYXdlcicsXG4gICAgICAgICAgdGV4dDogJ0RyYXdlciBcdTYyQkRcdTVDNDknLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGluazogJ2NvbW1vbi11aS9pZ291cmQtZm9ybScsXG4gICAgICAgICAgdGV4dDogJ0Zvcm0gXHU4ODY4XHU1MzU1JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdjb21tb24tdWkvaWdvdXJkLXZ4ZS10YWJsZScsXG4gICAgICAgICAgdGV4dDogJ1Z4ZSBUYWJsZSBcdTg4NjhcdTY4M0MnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGluazogJ2NvbW1vbi11aS9pZ291cmQtY291bnQtdG8tYW5pbWF0b3InLFxuICAgICAgICAgIHRleHQ6ICdDb3VudFRvQW5pbWF0b3IgXHU2NTcwXHU1QjU3XHU1MkE4XHU3NTNCJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxpbms6ICdjb21tb24tdWkvaWdvdXJkLWVsbGlwc2lzLXRleHQnLFxuICAgICAgICAgIHRleHQ6ICdFbGxpcHNpc1RleHQgXHU3NzAxXHU3NTY1XHU2NTg3XHU2NzJDJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXTtcbn1cblxuZnVuY3Rpb24gbmF2KCk6IERlZmF1bHRUaGVtZS5OYXZJdGVtW10ge1xuICByZXR1cm4gW1xuICAgIHtcbiAgICAgIGFjdGl2ZU1hdGNoOiAnXi8oZ3VpZGV8Y29tcG9uZW50cykvJyxcbiAgICAgIHRleHQ6ICdcdTY1ODdcdTY4NjMnLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGFjdGl2ZU1hdGNoOiAnXi9ndWlkZS8nLFxuICAgICAgICAgIGxpbms6ICcvZ3VpZGUvaW50cm9kdWN0aW9uL2lnb3VyZCcsXG4gICAgICAgICAgdGV4dDogJ1x1NjMwN1x1NTM1NycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBhY3RpdmVNYXRjaDogJ14vY29tcG9uZW50cy8nLFxuICAgICAgICAgIGxpbms6ICcvY29tcG9uZW50cy9pbnRyb2R1Y3Rpb24nLFxuICAgICAgICAgIHRleHQ6ICdcdTdFQzRcdTRFRjYnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogJ1x1NTM4Nlx1NTNGMlx1NzI0OFx1NjcyQycsXG4gICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vZG9jLnZ2YmluLmNuJyxcbiAgICAgICAgICAgICAgdGV4dDogJzIueFx1NzI0OFx1NjcyQ1x1NjU4N1x1Njg2MycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ1x1NkYxNFx1NzkzQScsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogJ0lnb3VyZCBBZG1pbicsXG4gICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICdodHRwczovL3d3dy5pZ291cmQucHJvJyxcbiAgICAgICAgICAgICAgdGV4dDogJ1x1NkYxNFx1NzkzQVx1NzI0OFx1NjcyQycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vYW50Lmlnb3VyZC5wcm8nLFxuICAgICAgICAgICAgICB0ZXh0OiAnQW50IERlc2lnbiBWdWUgXHU3MjQ4XHU2NzJDJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9uYWl2ZS5pZ291cmQucHJvJyxcbiAgICAgICAgICAgICAgdGV4dDogJ05haXZlIFx1NzI0OFx1NjcyQycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vZWxlLmlnb3VyZC5wcm8nLFxuICAgICAgICAgICAgICB0ZXh0OiAnRWxlbWVudCBQbHVzXHU3MjQ4XHU2NzJDJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6ICdcdTUxNzZcdTRFRDYnLFxuICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9pZ291cmQudnZiaW4uY24nLFxuICAgICAgICAgICAgICAgIHRleHQ6ICdJZ291cmQgQWRtaW4gMi54JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiB2ZXJzaW9uLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2lnb3VyZGpzL3Z1ZS1pZ291cmQtYWRtaW4vcmVsZWFzZXMnLFxuICAgICAgICAgIHRleHQ6ICdcdTY2RjRcdTY1QjBcdTY1RTVcdTVGRDcnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vb3Jncy9pZ291cmRqcy9wcm9qZWN0cy81JyxcbiAgICAgICAgICB0ZXh0OiAnXHU4REVGXHU3RUJGXHU1NkZFJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2lnb3VyZGpzL3Z1ZS1pZ291cmQtYWRtaW4vYmxvYi9tYWluLy5naXRodWIvY29udHJpYnV0aW5nLm1kJyxcbiAgICAgICAgICB0ZXh0OiAnXHU4RDIxXHU3MzJFJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICBsaW5rOiAnL2NvbW1lcmNpYWwvdGVjaG5pY2FsLXN1cHBvcnQnLFxuICAgICAgdGV4dDogJ1x1RDgzRVx1REQ4NCBcdTYyODBcdTY3MkZcdTY1MkZcdTYzMDEnLFxuICAgIH0sXG4gICAge1xuICAgICAgbGluazogJy9zcG9uc29yL3BlcnNvbmFsJyxcbiAgICAgIHRleHQ6ICdcdTI3MjggXHU4RDVFXHU1MkE5JyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGxpbms6ICcvY29tbWVyY2lhbC9jb21tdW5pdHknLFxuICAgICAgdGV4dDogJ1x1RDgzRFx1REM2OFx1MjAwRFx1RDgzRFx1REM2Nlx1MjAwRFx1RDgzRFx1REM2NiBcdTRFQTRcdTZENDFcdTdGQTQnLFxuICAgICAgLy8gaXRlbXM6IFtcbiAgICAgIC8vICAge1xuICAgICAgLy8gICAgIGxpbms6ICdodHRwczovL3F1bi5xcS5jb20vcXF3ZWIvcXVucHJvL3NoYXJlP193dj0zJl93d3Y9MTI4JmFwcENoYW5uZWw9c2hhcmUmaW52aXRlQ29kZT0yMnlTemo3cEtpdyZidXNpbmVzc1R5cGU9OSZmcm9tPTI0NjYxMCZiaXo9a2EmbWFpblNvdXJjZUlkPXNoYXJlJnN1YlNvdXJjZUlkPW90aGVycyZqdW1wc291cmNlPXNob3J0dXJsIy9wYycsXG4gICAgICAvLyAgICAgdGV4dDogJ1FRXHU5ODkxXHU5MDUzJyxcbiAgICAgIC8vICAgfSxcbiAgICAgIC8vICAge1xuICAgICAgLy8gICAgIGxpbms6ICdodHRwczovL3FtLnFxLmNvbS9jZ2ktYmluL3FtL3FyP193dj0xMDI3Jms9bWpabWxoZ1Z6elV4dmR4bGxCNkMxdkhwWDhPOFFSTDAmYXV0aEtleT1EQmRGYkJ3RVJtZmFLWTk1SnZSV3FMQ0pJUkdKQW1LeVpicnB6WjQxRUtETVo1U1I2TWZiak9CYWFOUk43M2ZyJm5vdmVyaWZ5PTAmZ3JvdXBfY29kZT00Mjg2MTA5JyxcbiAgICAgIC8vICAgICB0ZXh0OiAnUVFcdTdGQTQnLFxuICAgICAgLy8gICB9LFxuICAgICAgLy8gICB7XG4gICAgICAvLyAgICAgbGluazogJ2h0dHBzOi8vZGlzY29yZC5nZy9WVTYyalRlY2FkJyxcbiAgICAgIC8vICAgICB0ZXh0OiAnRGlzY29yZCcsXG4gICAgICAvLyAgIH0sXG4gICAgICAvLyBdLFxuICAgIH0sXG4gICAgLy8ge1xuICAgIC8vICAgbGluazogJy9mcmllbmQtbGlua3MvJyxcbiAgICAvLyAgIHRleHQ6ICdcdUQ4M0VcdUREMUQgXHU1M0NCXHU2MEM1XHU5NEZFXHU2M0E1JyxcbiAgICAvLyB9LFxuICBdO1xufVxuXG5leHBvcnQgY29uc3Qgc2VhcmNoOiBEZWZhdWx0VGhlbWUuQWxnb2xpYVNlYXJjaE9wdGlvbnNbJ2xvY2FsZXMnXSA9IHtcbiAgcm9vdDoge1xuICAgIHBsYWNlaG9sZGVyOiAnXHU2NDFDXHU3RDIyXHU2NTg3XHU2ODYzJyxcbiAgICB0cmFuc2xhdGlvbnM6IHtcbiAgICAgIGJ1dHRvbjoge1xuICAgICAgICBidXR0b25BcmlhTGFiZWw6ICdcdTY0MUNcdTdEMjJcdTY1ODdcdTY4NjMnLFxuICAgICAgICBidXR0b25UZXh0OiAnXHU2NDFDXHU3RDIyXHU2NTg3XHU2ODYzJyxcbiAgICAgIH0sXG4gICAgICBtb2RhbDoge1xuICAgICAgICBlcnJvclNjcmVlbjoge1xuICAgICAgICAgIGhlbHBUZXh0OiAnXHU0RjYwXHU1M0VGXHU4MEZEXHU5NzAwXHU4OTgxXHU2OEMwXHU2N0U1XHU0RjYwXHU3Njg0XHU3RjUxXHU3RURDXHU4RkRFXHU2M0E1JyxcbiAgICAgICAgICB0aXRsZVRleHQ6ICdcdTY1RTBcdTZDRDVcdTgzQjdcdTUzRDZcdTdFRDNcdTY3OUMnLFxuICAgICAgICB9LFxuICAgICAgICBmb290ZXI6IHtcbiAgICAgICAgICBjbG9zZVRleHQ6ICdcdTUxNzNcdTk1RUQnLFxuICAgICAgICAgIG5hdmlnYXRlVGV4dDogJ1x1NTIwN1x1NjM2MicsXG4gICAgICAgICAgc2VhcmNoQnlUZXh0OiAnXHU2NDFDXHU3RDIyXHU2M0QwXHU0RjlCXHU4MDA1JyxcbiAgICAgICAgICBzZWxlY3RUZXh0OiAnXHU5MDA5XHU2MkU5JyxcbiAgICAgICAgfSxcbiAgICAgICAgbm9SZXN1bHRzU2NyZWVuOiB7XG4gICAgICAgICAgbm9SZXN1bHRzVGV4dDogJ1x1NjVFMFx1NkNENVx1NjI3RVx1NTIzMFx1NzZGOFx1NTE3M1x1N0VEM1x1Njc5QycsXG4gICAgICAgICAgcmVwb3J0TWlzc2luZ1Jlc3VsdHNMaW5rVGV4dDogJ1x1NzBCOVx1NTFGQlx1NTNDRFx1OTk4OCcsXG4gICAgICAgICAgcmVwb3J0TWlzc2luZ1Jlc3VsdHNUZXh0OiAnXHU0RjYwXHU4QkE0XHU0RTNBXHU4QkU1XHU2N0U1XHU4QkUyXHU1RTk0XHU4QkU1XHU2NzA5XHU3RUQzXHU2NzlDXHVGRjFGJyxcbiAgICAgICAgICBzdWdnZXN0ZWRRdWVyeVRleHQ6ICdcdTRGNjBcdTUzRUZcdTRFRTVcdTVDMURcdThCRDVcdTY3RTVcdThCRTInLFxuICAgICAgICB9LFxuICAgICAgICBzZWFyY2hCb3g6IHtcbiAgICAgICAgICBjYW5jZWxCdXR0b25BcmlhTGFiZWw6ICdcdTUzRDZcdTZEODgnLFxuICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6ICdcdTUzRDZcdTZEODgnLFxuICAgICAgICAgIHJlc2V0QnV0dG9uQXJpYUxhYmVsOiAnXHU2RTA1XHU5NjY0XHU2N0U1XHU4QkUyXHU2NzYxXHU0RUY2JyxcbiAgICAgICAgICByZXNldEJ1dHRvblRpdGxlOiAnXHU2RTA1XHU5NjY0XHU2N0U1XHU4QkUyXHU2NzYxXHU0RUY2JyxcbiAgICAgICAgfSxcbiAgICAgICAgc3RhcnRTY3JlZW46IHtcbiAgICAgICAgICBmYXZvcml0ZVNlYXJjaGVzVGl0bGU6ICdcdTY1MzZcdTg1Q0YnLFxuICAgICAgICAgIG5vUmVjZW50U2VhcmNoZXNUZXh0OiAnXHU2Q0ExXHU2NzA5XHU2NDFDXHU3RDIyXHU1Mzg2XHU1M0YyJyxcbiAgICAgICAgICByZWNlbnRTZWFyY2hlc1RpdGxlOiAnXHU2NDFDXHU3RDIyXHU1Mzg2XHU1M0YyJyxcbiAgICAgICAgICByZW1vdmVGYXZvcml0ZVNlYXJjaEJ1dHRvblRpdGxlOiAnXHU0RUNFXHU2NTM2XHU4NUNGXHU0RTJEXHU3OUZCXHU5NjY0JyxcbiAgICAgICAgICByZW1vdmVSZWNlbnRTZWFyY2hCdXR0b25UaXRsZTogJ1x1NEVDRVx1NjQxQ1x1N0QyMlx1NTM4Nlx1NTNGMlx1NEUyRFx1NzlGQlx1OTY2NCcsXG4gICAgICAgICAgc2F2ZVJlY2VudFNlYXJjaEJ1dHRvblRpdGxlOiAnXHU0RkREXHU1QjU4XHU4MUYzXHU2NDFDXHU3RDIyXHU1Mzg2XHU1M0YyJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJULFNBQVMsZUFBZTtBQUNuVixTQUFTLDZCQUE2Qjs7O0FDQ3RDLFNBQVMsb0JBQW9COzs7QUNBM0IsY0FBVzs7O0FESU4sSUFBTSxLQUFLLGFBQWE7QUFBQSxFQUM3QixhQUFhO0FBQUEsRUFDYixNQUFNO0FBQUEsRUFDTixhQUFhO0FBQUEsSUFDWCxxQkFBcUI7QUFBQSxJQUNyQixxQkFBcUI7QUFBQSxJQUNyQixXQUFXO0FBQUEsTUFDVCxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsVUFBVTtBQUFBLE1BQ1IsU0FDRTtBQUFBLE1BQ0YsTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNFLFdBQVcsd0JBQW9CLG9CQUFJLEtBQUssR0FBRSxZQUFZLENBQUM7QUFBQSxNQUMvRCxTQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0EsZUFBZTtBQUFBLElBQ2YsYUFBYTtBQUFBLE1BQ1gsZUFBZTtBQUFBLFFBQ2IsV0FBVztBQUFBLFFBQ1gsV0FBVztBQUFBLE1BQ2I7QUFBQSxNQUNBLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxzQkFBc0I7QUFBQSxJQUN0QixLQUFLLElBQUk7QUFBQSxJQUNULFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxJQUNUO0FBQUEsSUFDQSxrQkFBa0I7QUFBQSxJQUNsQixTQUFTO0FBQUEsTUFDUCxtQkFBbUI7QUFBQSxRQUNqQixNQUFNO0FBQUEsUUFDTixPQUFPLGtCQUFrQjtBQUFBLE1BQzNCO0FBQUEsTUFDQSxjQUFjLEVBQUUsTUFBTSxjQUFjLE9BQU8sYUFBYSxFQUFFO0FBQUEsSUFDNUQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQztBQUVELFNBQVMsZUFBMkM7QUFDbEQsU0FBTztBQUFBLElBQ0w7QUFBQSxNQUNFLFdBQVc7QUFBQSxNQUNYLE1BQU07QUFBQSxNQUNOLE9BQU87QUFB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
