import axios from "axios";
import { useEffect, useState } from "react";
import SignUp from "./pages/SingUp/SignUp";

function App() {
  const [heading, setHeading] = useState("");
  const getHeading = async () => {
    const response = await axios.get("/home");
    setHeading(response.data.text);
  };
  useEffect(() => {
    getHeading();
  }, []);
  return (
    <div>
      <SignUp />
    </div>
  );
}

export default App;
