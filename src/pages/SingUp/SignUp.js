import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "../../Layout/UI/Form";
import Button from "../../Layout/UI/Button";

const SignUp = () => {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const phoneRef = useRef("");
  const pswdRef = useRef("");

  const signUpSubmitHandler = async (event) => {
    event.preventDefault();
    const nameValue = nameRef.current.value;
    const emailValue = emailRef.current.value;
    const phoneValue = phoneRef.current.value;
    const pswdValue = pswdRef.current.value;

    console.log(nameValue, emailValue, phoneValue, pswdValue);
  };
  return (
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
  );
};

export default SignUp;
