import request from '@/utils/request';

export async function queryList(params) {
  return request('/Common/Page', {
    params,
  });
}

export async function create(params) {
  return request('/Common/Create', {
    method: 'POST',
    data: params,
  });
}