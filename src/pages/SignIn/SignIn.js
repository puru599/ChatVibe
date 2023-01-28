import React, { useRef, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Form from "../../Layout/UI/Form";
import Button from "../../Layout/UI/Button";

const SignUp = () => {
  const emailPhnRef = useRef("");
  const pswdRef = useRef("");
  const [error, setError] = useState(false);

  const signInSubmitHandler = async (event) => {
    event.preventDefault();
    const data = {
      emailPhn: emailPhnRef.current.value,
      password: pswdRef.current.value
    };
    if (data.emailPhn.includes("@")) {
      console.log("Email");
    } else {
      console.log("Phone Number");
    }
    // try {
    //   const response = await axios.post("http://localhost:5000/signUp", data, {
    //     headers: { "content-type": "application/json" }
    //   });
    //   if (response.status !== 201) {
    //     throw new Error(response);
    //   } else {
    //     console.log(response);
    //   }
    // } catch (error) {
    //   console.log(error.response);
    //   setError(error.response.data.errors[0].path);
    // }
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
      </Form>
      {error ? <h4>{error}</h4> : null}
    </React.Fragment>
  );
};

export default SignUp;
