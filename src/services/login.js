import request from '@/utils/request';

export async function accountLogin(params) {
  return request('/Admin/Signin', {
    method: 'POST',
    data: params,
  });
}
