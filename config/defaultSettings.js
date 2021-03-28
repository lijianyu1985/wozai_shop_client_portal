import configs from './env';

export default {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'sidemenu',
  contentWidth: 'Fluid',
  fixedHeader: false,
  autoHideHeader: false,
  fixSiderbar: false,
  colorWeak: false,
  menu: {
    locale: false,
  },
  title: 'Ant Design Pro',
  pwa: false,
  iconfontUrl: '',
  baseUrl: configs[process.env.NODE_ENV].API_SERVER,
};
