import { Redirect, Route } from "react-router-dom";
import React, { Fragment } from "react";
import SignUp from "./pages/SingUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import Home from "./pages/Home/Home";
import { useSelector } from "react-redux";

function App() {
  const isLoggedIn = useSelector((state) => state.chat.isLoggedIn);
  return (
    <Fragment>
      <Route path="/signIn" exact>
        <SignIn />
      </Route>
      <Route path="/signUp" exact>
        <SignUp />
      </Route>
      <Route path="/home" exact>
        {!!isLoggedIn ? <Home /> : <Redirect to="/signIn" />}
      </Route>
    </Fragment>
  );
}

export default App;
