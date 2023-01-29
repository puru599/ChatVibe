import React, { useRef, useState } from "react";
import axios from "axios";
import { decodeToken } from "react-jwt";
import { Link, useHistory } from "react-router-dom";
import Form from "../../Layout/UI/Form";
import Button from "../../Layout/UI/Button";
import classes from "./SignIn.module.css";

const SignUp = () => {
  const emailPhnRef = useRef("");
  const pswdRef = useRef("");
  const [message, setMessage] = useState(false);
  const history = useHistory("");

  const signInSubmitHandler = async (event) => {
    event.preventDefault();
    const data = {
      credential: emailPhnRef.current.value,
      password: pswdRef.current.value
    };
    try {
      const response = await axios.post("http://localhost:5000/signIn", data, {
        headers: { "content-type": "application/json" }
      });
      if (response.status === 200) {
        const jwtToken = response.data.jwtToken;
        const tokenData = decodeToken(jwtToken);
        localStorage.setItem("userName", tokenData.userName);
        history.push("/chat");
      } else {
        throw new Error(response);
      }
    } catch (error) {
      setMessage(error.response.data);
    }
  };
  return (
    <React.Fragment>
      <Form onSubmit={signInSubmitHandler}>
        <div>
          <h3>Sign In</h3>
        </div>
        <div>
          <input
            id="emailId"
            placeholder="Email or Phone Number"
            type="text"
            ref={emailPhnRef}
            required
          ></input>
          <input
            id="passwordId"
            placeholder="Password"
            type="password"
            ref={pswdRef}
            required
          />
        </div>
        <Button>Sign In</Button>
        <Link to="/signUp">New user, SignUp...</Link>
      </Form>
      {message ? <h4 className={classes.Message}>{message}</h4> : null}
    </React.Fragment>
  );
};

export default SignUp;
