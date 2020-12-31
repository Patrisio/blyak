import { createContext } from 'react';

const noop = () => {};

export const AuthContext = createContext({
  token: null,
  userId: null,
  login: noop,
  logout: noop,
  isAuhenticated: false,
  socket: null,
});