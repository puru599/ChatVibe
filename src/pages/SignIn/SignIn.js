import React, { useRef, useState } from "react";
import axios from "axios";
import { decodeToken } from "react-jwt";
import { Link, useHistory } from "react-router-dom";
import Form from "../../UI/Form";
import Button from "../../UI/Button";
import classes from "./SignIn.module.css";
import { useDispatch } from "react-redux";
import { ChatActions } from "../../ReduxStore/ReduxSlices/ChatSlice";
import messageIcon from "../../Assets/messages.png";

const SignUp = () => {
  const history = useHistory("");
  const dispatch = useDispatch();

  const emailPhnRef = useRef("");
  const pswdRef = useRef("");

  const [message, setMessage] = useState(false);

  const signInSubmitHandler = async (event) => {
    event.preventDefault();

    const data = {
      credential: emailPhnRef.current.value,
      password: pswdRef.current.value
    };

    try {
      const response = await axios.post(
        "https://group-chat-backend-i2bd.onrender.com/signIn",
        data,
        {
          headers: { "content-type": "application/json" }
        }
      );

      if (response.status === 200) {
        const jwtToken = response.data.jwtToken;
        const tokenData = decodeToken(jwtToken);
        const userData = JSON.stringify({
          userId: tokenData.id,
          userName: tokenData.userName
        });

        localStorage.setItem("userData", userData);
        localStorage.setItem("isLoggedIn", true);

        dispatch(ChatActions.setIsLoggedIn(true));

        history.push("/home");
      } else {
        throw new Error(response);
      }
    } catch (error) {
      setMessage(error.response.data);
    }
  };
  return (
    <React.Fragment>
      <img
        src={messageIcon}
        alt="Messenger"
        className={classes.mainImage}
      ></img>
      <Form onSubmit={signInSubmitHandler}>
        <div>
          <h3>Sign In</h3>
        </div>
        <div>
          <input
            id="emailId"
            placeholder="Email or Phone"
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
