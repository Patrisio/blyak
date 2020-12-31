import { MESSAGES } from '../constants';

const loadMessages = () => ({ type: MESSAGES.LOAD });
const addMessage = (message) => ({
  type: MESSAGES.ADD,
  message
});

export {
  loadMessages,
  addMessage
};