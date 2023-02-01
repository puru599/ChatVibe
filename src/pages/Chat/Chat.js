import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const Chat = (props) => {
  const messageRef = useRef("");
  const friendData = props.friendData;

  const [chatData, setChatData] = useState([]);

  const { userId, userName } = JSON.parse(localStorage.getItem("userData"));

  const sendMessageHandler = async (event) => {
    event.preventDefault();

    const message = messageRef.current.value;

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        userId,
        userName,
        message,
        toId: friendData.id,
        toName: friendData.userName
      });

      if (response.status === 200) {
        fetchChatData();
        messageRef.current.value = "";
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChatData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/chat", {
        headers: {
          userId: userId,
          toId: friendData.id
        }
      });

      if (response.status === 200) {
        setChatData(response.data);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchChatData();
    // const interval = setInterval(() => {
    //   getChatDataLS();
    // }, 1000);
    // return () => {
    //   clearInterval(interval);
    // };
  }, [friendData]);

  return (
    <React.Fragment>
      <h2>Messages</h2>
      <ul></ul>
      <form onSubmit={sendMessageHandler}>
        <input
          type="text"
          id="messageId"
          placeholder="Message"
          ref={messageRef}
          required
        ></input>
        <button type="submit">Send</button>
      </form>
      <ul>
        {chatData.map((item) => (
          <li key={Math.random()}>
            {item.userName} : {item.message}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default Chat;
