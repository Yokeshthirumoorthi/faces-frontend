import React from "react";
import Signup from "./Signup";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AppPageRouter from "./AlbumsDashboard";
import Home from "./Home";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import PageNotFound from "./404page";
import ForgotPassword from "./ForgotPassword";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute path="/app" component={AppPageRouter} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route component={PageNotFound} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
