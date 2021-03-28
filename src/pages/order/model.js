import modelFactory from '../../utils/modelFactory';

const Model = modelFactory({
  namespace: 'order',
  state: {
    list: [],
  },
  effects: {},
  reducers: {},
});

export default Model;
