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

export async function publish(params) {
  return request('/Commodity/Publish', {
    method: 'POST',
    data: params,
  });
}

export async function withdraw(params) {
  return request('/Commodity/Withdraw', {
    method: 'POST',
    data: params,
  });
}

export async function discard(params) {
  return request('/Commodity/Discard', {
    method: 'POST',
    data: params,
  });
}
