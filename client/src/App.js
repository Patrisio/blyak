import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { rootReducer } from './reducers';
import io from 'socket.io-client';
import useAuth from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import { useRoutes } from './routes';

import { BrowserRouter as Router } from 'react-router-dom';

export default function App() {
  const { token, login, logout, userId } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);
  const socket = io('localhost:5000');

  const store = createStore(rootReducer);
  
  // console.log(socketio);

  // socket.on('connect', () => {
  //   console.log('connect');
  //   // socket.on('chatMessage', msg => {
  //   //   console.log(msg);
  //   // });
  // });

  return (
    <Provider store={store}>
      <AuthContext.Provider value={{ token, login, logout, userId, isAuthenticated, socket }}>
        <Router>
          {routes}
        </Router>
      </AuthContext.Provider>
    </Provider>
  );
}