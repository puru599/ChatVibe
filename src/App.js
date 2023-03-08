import { Redirect, Route, Switch } from "react-router-dom";
import React, { Fragment, Suspense } from "react";
import { useSelector } from "react-redux";

const SignUp = React.lazy(() => import("./pages/SingUp/SignUp"));
const SignIn = React.lazy(() => import("./pages/SignIn/SignIn"));
const Home = React.lazy(() => import("./pages/Home/Home"));

function App() {
  const isLoggedIn = useSelector((state) => state.chat.isLoggedIn);

  return (
    <Fragment>
      <Suspense>
        <Switch>
          <Route path="/signIn">
            <SignIn />
          </Route>
          <Route path="/signUp">
            <SignUp />
          </Route>
          <Route path="/home">
            {!!isLoggedIn ? <Home /> : <Redirect to="/signIn" />}
          </Route>
          {!isLoggedIn ? (
            <Route path="*">
              <Redirect to="/signIn" />
            </Route>
          ) : (
            <Route path="*">
              <Redirect to="/home" />
            </Route>
          )}
        </Switch>
      </Suspense>
    </Fragment>
  );
}

export default App;
