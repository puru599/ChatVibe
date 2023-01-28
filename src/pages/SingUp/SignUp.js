import React, { useRef, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Form from "../../Layout/UI/Form";
import Button from "../../Layout/UI/Button";

const SignUp = () => {
  const history = useHistory("");
  const nameRef = useRef("");
  const emailRef = useRef("");
  const phoneRef = useRef("");
  const pswdRef = useRef("");
  const [error, setError] = useState(false);

  const signUpSubmitHandler = async (event) => {
    event.preventDefault();
    const data = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: pswdRef.current.value
    };
    try {
      const response = await axios.post("http://localhost:5000/signUp", data, {
        headers: { "content-type": "application/json" }
      });
      if (response.status !== 201) {
        throw new Error(response);
      } else {
        history.push("/signIn");
      }
    } catch (error) {
      if (error.response.data.errors[0].value === data.email) {
        setError("User Email Already Exists, Please Login...");
      }
      if (error.response.data.errors[0].value === data.phone) {
        setError("User Phone Number Already Exists, Please Login...");
      }
    }
  };
  return (
    <React.Fragment>
      <Form onSubmit={signUpSubmitHandler}>
        <div>
          <h3>Sign Up</h3>
        </div>
        <div>
          <input
            id="nameId"
            placeholder="Username"
            type="text"
            ref={nameRef}
            required
          ></input>
          <input
            id="emailId"
            placeholder="Email"
            type="text"
            ref={emailRef}
            required
          ></input>
          <input
            id="phnId"
            placeholder="Phone Number"
            type="tel"
            ref={phoneRef}
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
        <Button>Sign Up</Button>
      </Form>
      {error ? <h4>{error}</h4> : null}
    </React.Fragment>
  );
};

export default SignUp;
