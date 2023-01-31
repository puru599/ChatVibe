import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const Chat = () => {
  const messageRef = useRef("");

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
        toId: 2,
        toName: "Dileep"
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
          toId: 2
        }
      });

      if (response.status === 200) {
        setChatLS(response.data);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getChatDataLS = () => {
    const chat = localStorage.getItem("chatData");

    if (!!chat) {
      const parsedChat = JSON.parse(chat);
      setChatData(parsedChat);
    }
  };

  const setChatLS = (data) => {
    const slicedChat = [];

    if (data.length > 999) {
      for (let i = data.length - 1000; i < data.length; i++) {
        slicedChat.push(data[i]);
      }
      const parsedSlicedChat = JSON.stringify(slicedChat);
      localStorage.setItem("chatData", parsedSlicedChat);
    } else {
      const parsedChat = JSON.stringify(data);
      localStorage.setItem("chatData", parsedChat);
    }
  };

  useEffect(() => {
    fetchChatData();
    getChatDataLS();
    // const interval = setInterval(() => {
    // getChatDataLS();
    // }, 1000);
    // return () => clearInterval(interval);
  }, []);

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
