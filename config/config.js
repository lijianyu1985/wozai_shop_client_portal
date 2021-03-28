import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
import proxy from './proxy';
import webpackPlugin from './plugin.config';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, REACT_APP_ENV } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  ['umi-plugin-antd-icon-config', {}],
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      Routes: ['src/pages/Authorized'],
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['super_admin', 'product_admin'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
              authority: ['super_admin', 'product_admin'],
            },
            {
              path: '/welcome',
              name: '欢迎',
              icon: 'smile',
              component: './Welcome',
              authority: ['super_admin', 'product_admin'],
            },
            {
              path: '/product',
              name: '产品',
              icon: 'crown',
              authority: ['super_admin', 'product_admin'],
              routes: [
                {
                  path: '/product/category',
                  name: '产品分类',
                  icon: 'build',
                  authority: ['super_admin', 'product_admin'],
                  routes: [
                    {
                      path: '/product/category',
                      name: '产品分类列表',
                      redirect: '/product/category/list',
                      hideInMenu: true,
                      authority: ['super_admin', 'product_admin'],
                    },
                    {
                      path: '/product/category/list',
                      name: '产品分类列表',
                      component: './category/list',
                      hideInMenu: true,
                      authority: ['super_admin', 'product_admin'],
                    },
                    {
                      path: '/product/category/edit',
                      name: '产品分类编辑',
                      component: './category/edit',
                      hideInMenu: true,
                      authority: ['super_admin', 'product_admin'],
                    },
                  ],
                },
                {
                  path: '/product/commodity',
                  name: '商品',
                  icon: 'build',
                  authority: ['super_admin', 'product_admin'],
                  routes: [
                    {
                      path: '/product/commodity',
                      name: '商品列表',
                      redirect: '/product/commodity/list',
                      hideInMenu: true,
                      authority: ['super_admin', 'product_admin'],
                    },
                    {
                      path: '/product/commodity/list',
                      name: '商品列表',
                      component: './commodity/list',
                      hideInMenu: true,
                      authority: ['super_admin', 'product_admin'],
                    },
                    {
                      path: '/product/commodity/edit',
                      name: '商品编辑',
                      component: './commodity/edit',
                      hideInMenu: true,
                      authority: ['super_admin', 'product_admin'],
                    },
                    {
                      path: '/product/commodity/editSku',
                      name: '商品库存编辑',
                      component: './commodity/editSku',
                      hideInMenu: true,
                      authority: ['super_admin', 'product_admin'],
                    },
                  ],
                },
              ],
            },
            {
              path: '/order',
              name: '订单',
              icon: 'crown',
              authority: ['super_admin'],
              routes: [
                {
                  path: '/order/list',
                  name: '订单列表',
                  icon: 'build',
                  authority: ['super_admin'],
                  routes: [
                    {
                      path: '/order/list',
                      name: '订单列表',
                      component: './order/list',
                      hideInMenu: true,
                      authority: ['super_admin'],
                    },
                  ],
                },
              ],
            },
            {
              component: './404',
              authority: ['super_admin', 'product_admin'],
            },
          ],
        },
        {
          component: './404',
          authority: ['super_admin', 'product_admin'],
        },
      ],
    },
    {
      component: './404',
      authority: ['super_admin', 'product_admin'],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
  chainWebpack: webpackPlugin,
};
