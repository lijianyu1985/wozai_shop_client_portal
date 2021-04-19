import modelFactory from '../../utils/modelFactory';
import { cancel, createShipping } from './service';
import { getMerchantAddress } from '../../services/system';

const Model = modelFactory({
  namespace: 'order',
  state: {
    list: [],
  },
  effects: {
    *cancel({ payload, callback }, { call }) {
      const response = yield call(cancel, payload);
      if (response && response.success) {
        // eslint-disable-next-line no-unused-expressions
        if (callback) {
          callback(response);
        }
      }
    },
    *getMerchantAddress({ payload, callback }, { call }) {
      const response = yield call(getMerchantAddress, payload);
      if (response && response.success) {
        // eslint-disable-next-line no-unused-expressions
        if (callback) {
          callback(response);
        }
      }
    },
    *createShipping({ payload, callback }, { call }) {
      const response = yield call(createShipping, payload);
      if (response && response.success) {
        // eslint-disable-next-line no-unused-expressions
        if (callback) {
          callback(response);
        }
      }
    },
  },
  reducers: {},
});

export default Model;
