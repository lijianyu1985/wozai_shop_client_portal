import request from '@/utils/request';

export async function getMerchantAddress() {
  return request('/System/MerchantAddress');
}
