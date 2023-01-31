import { Route } from "react-router-dom";
import React, { Fragment } from "react";
import SignUp from "./pages/SingUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import Chat from "./pages/Chat/Chat";
import Group from "./pages/Group/Group";

function App() {
  return (
    <React.Fragment>
      <Route path="/signIn" exact>
        <SignIn />
      </Route>
      <Route path="/signUp" exact>
        <SignUp />
      </Route>
      <Route path="/chat" exact>
        <Chat />
        <Group />
      </Route>
    </React.Fragment>
  );
}

export default App;
