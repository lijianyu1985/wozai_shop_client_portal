import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import lodash from 'lodash';
import config from '../../config/defaultSettings';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};
export const getRouteAuthority = (path, routeData) => {
  let authorities;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      } // exact match

      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

export const buildPictureUrl = url => {
  let pictureUrl = encodeURI(url);
  if (!lodash.startsWith(pictureUrl, 'http://') && !lodash.startsWith(pictureUrl, 'https://')) {
    pictureUrl = `${lodash.trimEnd(config.baseUrl, '/')}/${lodash.trimStart(pictureUrl, '/')}`;
  }
  return pictureUrl;
};

export const trimBaseUrl = url => {
  let pictureUrl = decodeURI(url);
  if (lodash.startsWith(pictureUrl, 'http://') || lodash.startsWith(pictureUrl, 'https://')) {
    pictureUrl = lodash.replace(pictureUrl, lodash.trimEnd(config.baseUrl, '/'), '');
  }
  return pictureUrl;
};

export const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const buildAddress = address => {
  if (!address) {
    return '';
  }
  return `${address.province}, ${address.city}, ${address.county}, ${address.address}`;
};

export const toDisplayTimestamp = timestamp => {
  if (!timestamp) {
    return '';
  }
  const timestapDate = new Date(timestamp);
  if (Number.isNaN(timestapDate.getTime())) {
    return '';
  }
  return `${timestapDate.getFullYear()}-${timestapDate.getMonth() +
    1}-${timestapDate.getDate()} ${timestapDate.getHours()}:${timestapDate.getMinutes()}:${timestapDate.getSeconds()}`;
};

export const toDisplayDate = timestamp => {
  if (!timestamp) {
    return '';
  }
  const timestapDate = new Date(timestamp);
  if (Number.isNaN(timestapDate.getTime())) {
    return '';
  }
  return `${timestapDate.getFullYear()}-${timestapDate.getMonth() + 1}-${timestapDate.getDate()}`;
};

export const clearEmptyFields = val => {
  const result = {};
  lodash.forIn(val, function(value, key) {
    if (value) {
      result[key] = value;
    }
  });
  return result;
};

export const jsonConvertToFlatten = val => {
  const result = {};
  const reStructure = (arr, v, target) => {
    if (arr.length === 0) {
      return;
    }
    if (arr.length === 1) {
      // eslint-disable-next-line no-param-reassign
      target[arr[0]] = v;
      return;
    }
    if (!target[arr[0]]) {
      // eslint-disable-next-line no-param-reassign
      target[arr[0]] = {};
    }
    reStructure(arr.slice(1), v, target[arr[0]]);
  };
  lodash.forIn(val, function(value, key) {
    const keys = key.split('.');
    reStructure(keys, value, result);
  });
  return result;
};
