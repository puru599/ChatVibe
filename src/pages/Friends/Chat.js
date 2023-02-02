import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ChatActions } from "../../ReduxStore/ReduxSlices/ChatSlice";
import { useSelector } from "react-redux";

const Chat = () => {
  const dispatch = useDispatch();

  const messageRef = useRef("");

  const friendData = useSelector((state) => state.chat.activeFriend);

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
        dispatch(ChatActions.setChatData(response.data));
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
    </React.Fragment>
  );
};

export default Chat;
