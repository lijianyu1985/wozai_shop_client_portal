import request from '@/utils/request';

export async function queryCurrent() {
  return request('/AdminProfile/CurrentUser');
}
