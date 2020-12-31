import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';
import Chat from './pages/Chat';
import ChatSettings from './pages/ChatSettings';

export const useRoutes = isAuthenticated => (
  <Switch>
    <Route
      path="/project/:projectId/iframe/:clientId"
      component={Chat}
    />

    <PrivateRoute
      path="/project/:projectId/chat/settings"
      component={ChatSettings}
      isAuthenticated={isAuthenticated}
    />

    <PrivateRoute
      path="/project/:projectId/home"
      component={Home}
      isAuthenticated={isAuthenticated}
    />

    <Route path="/login" component={Login} />
    <Route path="/register" component={Registration} />

    <Redirect exact from="/" to="/project/:projectId/home" />
  </Switch>
);

const PrivateRoute = ({
  component: Component,
  isAuthenticated,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => (
      isAuthenticated ?
      (<Component {...props} />) : 
      (<Redirect to="/login" />)
    )}
  />
);