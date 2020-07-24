import request from '@/utils/request';

export async function accountLogin(params) {
  return request('/AdminAuth/Signin', {
    method: 'POST',
    data: params,
  });
}
