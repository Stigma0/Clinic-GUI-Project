import React, { Component } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import Login from './components/Login';
import UserContext, {UserProvider} from './components/UserContext'; // Import UserProvider

import './custom.css';
import axios from 'axios';
// Define a request interceptor
axios.interceptors.request.use(request => {
  console.log('Starting Request', JSON.stringify(request, null, 2));
  return request;
});
// Define a request interceptor
axios.interceptors.response.use(response => {
  console.log('Starting Response', JSON.stringify(response, null, 2));
  return response;
});
export default class App extends Component {
  static displayName = App.name;
  
  render() {
    return (
      <UserProvider>
        <UserContext.Consumer>
          {({ isAuthenticated }) => (
            !isAuthenticated ? <Login /> : (
              <Layout>
              <Routes>
                {AppRoutes.map((route, index) => {
                  const { element, ...rest } = route;
                  return <Route key={index} {...rest} element={element} />;
                })}
              </Routes>
            </Layout>
            )
          )}
        </UserContext.Consumer>
      </UserProvider>
    );
  }
}
