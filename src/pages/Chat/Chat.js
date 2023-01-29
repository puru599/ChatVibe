import axios from "axios";
import React, { useRef, useState } from "react";

const Chat = () => {
  const messageRef = useRef("");
  const [chatData, setChatData] = useState([]);
  const userName = localStorage.getItem("userName");
  const sendMessageHandler = async (event) => {
    event.preventDefault();
    const message = messageRef.current.value;
    const response = await axios.post("http://localhost:5000/chat", {
      userName,
      message
    });
    setChatData(response.data);
  };
  return (
    <React.Fragment>
      <h2>Chat</h2>
      <ul></ul>
      <form onSubmit={sendMessageHandler}>
        <input
          type="text"
          id="messageId"
          placeholder="Message"
          ref={messageRef}
        ></input>
        <button type="submit">Send</button>
      </form>
      <ul>
        {chatData.map((item) => (
          <li key={item.message}>
            {item.userName} : {item.message}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default Chat;
