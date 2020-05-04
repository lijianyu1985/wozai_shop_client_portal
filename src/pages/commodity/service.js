import request from '@/utils/request';

export async function create(params) {
  return request('/Commodity/Create', {
    method: 'POST',
    data: params,
  });
}

export async function change(params) {
  return request('/Commodity/Update', {
    method: 'POST',
    data: params,
  });
}

export async function getSkus(params) {
  return request('/Commodity/SkuDetails', {
    method: 'GET',
    params,
  });
}

export async function changeSkus(params) {
  return request('/Commodity/UpdateSkus', {
    method: 'POST',
    data: params,
  });
}