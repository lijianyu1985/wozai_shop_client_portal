import request from '@/utils/request';

export async function create(params) {
  return request('/Order/Create', {
    method: 'POST',
    data: params,
  });
}

export async function change(params) {
  return request('/Order/Update', {
    method: 'POST',
    data: params,
  });
}

export async function getSkus(params) {
  return request('/Order/SkuDetails', {
    method: 'GET',
    params,
  });
}

export async function changeSkus(params) {
  return request('/Order/UpdateSkus', {
    method: 'POST',
    data: params,
  });
}

export async function publish(params) {
  return request('/Order/Publish', {
    method: 'POST',
    data: params,
  });
}

export async function withdraw(params) {
  return request('/Order/Withdraw', {
    method: 'POST',
    data: params,
  });
}

export async function cancel(params) {
  return request('/Order/Cancel', {
    method: 'POST',
    data: params,
  });
}

export async function createShipping(params) {
  return request('/Order/CreateShipping', {
    method: 'POST',
    data: params,
  });
}
