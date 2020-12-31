import { combineReducers } from 'redux';
import { chatMessagesReducer } from './chatMessagesReducer';

export const rootReducer = combineReducers({
  chatMessages: chatMessagesReducer
});