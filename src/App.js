import { Route } from "react-router-dom";
import React, { Fragment } from "react";
import SignUp from "./pages/SingUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";

function App() {
  return (
    <React.Fragment>
      <Route path="/signIn" exact>
        <SignIn />
      </Route>
      <Route path="/signUp" exact>
        <SignUp />
      </Route>
    </React.Fragment>
  );
}

export default App;
