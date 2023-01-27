import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "../../Layout/UI/Form";
import Button from "../../Layout/UI/Button";

const SignUp = () => {
  const emailRef = useRef("");
  const pswdRef = useRef("");
  const confirmPswdRef = useRef("");

  const [emailValid, setEmailValid] = useState(false);
  const [pswdValid, setPswdValid] = useState(false);
  const [confirmValid, setConfirmValid] = useState(false);

  const history = useHistory();

  const signUpSubmitHandler = async (event) => {
    event.preventDefault();

    const emailValue = emailRef.current.value;
    const pswdValue = pswdRef.current.value;
    const confirmPswdValue = confirmPswdRef.current.value;
    console.log(emailValue, pswdValue, confirmPswdValue)
  };
  return (
    <Form onSubmit={signUpSubmitHandler}>
      <div>
        <h3>Sign Up</h3>
      </div>
      <div>
        <input
          id="emailId"
          placeholder="Email"
          type="text"
          ref={emailRef}
          required
        ></input>
        {emailValid && <p>Please Enter Valid Email</p>}
        <input
          id="passwordId"
          placeholder="Password"
          type="password"
          ref={pswdRef}
          required
        />
        {pswdValid && <p>Please Enter Valid Password</p>}
        <input
          id="confirmPwdId"
          placeholder="Confirm Password"
          type="password"
          ref={confirmPswdRef}
          required
        />
        {confirmValid && <p>Please Match the Password</p>}
      </div>
      <Button>Sign Up</Button>
    </Form>
  );
};

export default SignUp;
