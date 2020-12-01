import React, { useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.scss';

//Components
import Landing from './components/layout/Landing';
import Dashboard from './components/layout/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/routing/PrivateRoute';

//Redux
import { Provider } from 'react-redux';
import store from './store';
import Navbar from './components/layout/Navbar';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
      <Provider store={store}>
        <Router>
          <Navbar />
          <Route exact path="/" component={ Landing } />
          <section className="container">
            <Switch>
              <Route exact path="/login" component={ Login } />
              <Route exact path="/register" component={ Register } />
              <PrivateRoute path="/dashboard" component={ Dashboard } />
            </Switch>
          </section>
        </Router>
      </Provider>
  );
}

export default App;
