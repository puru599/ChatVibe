import { Route } from "react-router-dom";
import React, { Fragment } from "react";
import SignUp from "./pages/SingUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import Home from "./pages/Home/Home";

function App() {
  return (
    <Fragment>
      <Route path="/signIn" exact>
        <SignIn />
      </Route>
      <Route path="/signUp" exact>
        <SignUp />
      </Route>
      <Route path="/home" exact>
        <Home />
      </Route>
    </Fragment>
  );
}

export default App;
