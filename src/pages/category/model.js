import { queryList, create, change, get, remove } from './service';

const Model = {
  namespace: 'category',
  state: {
    list: [],
    current: {},
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
    *create({ payload, callback }, { call, put }) {
      const response = yield call(create, payload);
      if (response && response.success) {
        // eslint-disable-next-line no-unused-expressions
        if (callback) {
          callback(response);
        }
        yield put({
          type: 'currentCategory',
          payload: {},
        });
      }
    },
    *change({ payload, callback }, { call, put }) {
      const response = yield call(change, payload);
      if (response && response.success) {
        // eslint-disable-next-line no-unused-expressions
        if (callback) {
          callback(response);
        }
        yield put({
          type: 'currentCategory',
          payload: {},
        });
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (response && response.success) {
        // eslint-disable-next-line no-unused-expressions
        if (callback) {
          callback(response);
        }
      }
    },
    *get({ payload }, { call, put }) {
      const response = yield call(get, payload);
      if (response && response.success) {
        yield put({
          type: 'currentCategory',
          payload: response || {},
        });
      }
    },
    *resetCurrent({ payload }, { put }) {
      yield put({
        type: 'currentCategory',
        payload: payload || {},
      });
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
    currentCategory(state, action) {
      return {
        ...state,
        current: (action.payload && action.payload.data) || {},
      };
    },
  },
};
export default Model;
