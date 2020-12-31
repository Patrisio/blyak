import { MESSAGES } from '../constants';

const initialState = {
  clients: [],
};

export const chatMessagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGES.ADD:
      console.log({ ...state.clients, clients: action.message });
      return { ...state.clients, clients: action.message };

    default:
      return state;
  }
};