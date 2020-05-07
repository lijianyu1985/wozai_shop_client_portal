import modelFactory from '../../utils/modelFactory';
import { all } from '../../services/common';
import { create, change, getSkus, changeSkus, publish, withdraw, discard } from './service';

const Model = modelFactory({
    namespace: 'commodity',
    state: {
        allCategories: [],
        skusCommodity: {},
        skus: []
    },
    effects: {
        *queryAllCategories({ payload }, { call, put }) {
            const response = yield call(all, payload);
            if (response && response.success) {
                yield put({
                    type: 'allCategories',
                    payload: response || {},
                });
            }
        },
        *create({ payload, callback }, { call, put }) {
            const response = yield call(create, payload);
            if (response && response.success) {
                // eslint-disable-next-line no-unused-expressions
                callback && callback(response);
                yield put({
                    type: 'current',
                    payload: {},
                });
            }
        },
        *change({ payload, callback }, { call, put }) {
            const response = yield call(change, payload);
            if (response && response.success) {
                // eslint-disable-next-line no-unused-expressions
                callback && callback(response);
                yield put({
                    type: 'current',
                    payload: {},
                });
            }
        },
        *getSkus({ payload, callback }, { call, put }) {
            const response = yield call(getSkus, payload);
            if (response && response.success) {
                // eslint-disable-next-line no-unused-expressions
                callback && callback(response);
                yield put({
                    type: 'skuDetails',
                    payload: response || {},
                });
            }
        },
        *changeSkus({ payload, callback }, { call }) {
            const response = yield call(changeSkus, payload);
            if (response && response.success) {
                // eslint-disable-next-line no-unused-expressions
                callback && callback(response);
            }
        },
        *publish({ payload, callback }, { call }) {
            const response = yield call(publish, payload);
            if (response && response.success) {
                // eslint-disable-next-line no-unused-expressions
                callback && callback(response);
            }
        },
        *withdraw({ payload, callback }, { call }) {
            const response = yield call(withdraw, payload);
            if (response && response.success) {
                // eslint-disable-next-line no-unused-expressions
                callback && callback(response);
            }
        },
        *discard({ payload, callback }, { call }) {
            const response = yield call(discard, payload);
            if (response && response.success) {
                // eslint-disable-next-line no-unused-expressions
                callback && callback(response);
            }
        },
    },
    reducers: {
        allCategories(state, action) {
            return {
                ...state,
                allCategories: (action.payload && action.payload.list) || [],
            };
        },
        skuDetails(state, action) {
            return {
                ...state,
                skus: (action.payload && action.payload.data && action.payload.data.skus) || [],
                skusCommodity: (action.payload && action.payload.data && action.payload.data.commodity) || {}
            };
        }
    },
});

export default Model;
