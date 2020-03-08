import request from '@/utils/request';

export async function queryList(params) {
  return request('/Common/Page', {
    params,
  });
}
