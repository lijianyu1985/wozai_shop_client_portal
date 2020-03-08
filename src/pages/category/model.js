import { queryList } from './service';

const Model = {
  namespace: 'category',
  state: {
    list: [],
  },
  effects: {
    *page({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
      if (response && response.success) {
        yield put({
          type: 'pageList',
          payload: response || {},
        });
      }
    },
  },
  reducers: {
    pageList(state, action) {
      return {
        ...state,
        list: action.payload.list || [],
        page: action.payload.page || 1,
        size: action.payload.size || 10,
        total: action.payload.total || 0,
      };
    },
  },
};
export default Model;
