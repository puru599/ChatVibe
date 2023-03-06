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
      {!isLoggedIn ? (
        <Route path="*">
          <Redirect to="/signIn" />
        </Route>
      ) : (
        <Route path="*">
          <Redirect to="/home" />
        </Route>
      )}
      <Route path="/signIn">
        <SignIn />
      </Route>
      <Route path="/signUp">
        <SignUp />
      </Route>
      <Route path="/home">
        {!!isLoggedIn ? <Home /> : <Redirect to="/signIn" />}
      </Route>
    </Fragment>
  );
}

export default App;
