export const initialStore = () => {
  return {
    user: null // lo voy a llenar al hacer login
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_user':
      return {
        ...store,
        user: action.payload
      };

    case 'logout':
      return {
        ...store,
        user: null
      };

    default:
      throw Error('Unknown action.');
  }
}
