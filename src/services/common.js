import request from '@/utils/request';

export async function queryList(params) {
  return request('/Common/Page', {
    params,
  });
}

export async function all(params) {
  return request('/Common/All', {
    params,
  });
}

export async function create(params) {
  return request('/Common/Create', {
    method: 'POST',
    data: params,
  });
}

export async function change(params) {
  return request('/Common/Update', {
    method: 'POST',
    data: params,
  });
}

export async function get(params) {
  return request('/Common/Get', {
    method: 'GET',
    params,
  });
}

export async function remove(params) {
  return request('/Common/Delete', {
    method: 'DELETE',
    data: params,
  });
}
