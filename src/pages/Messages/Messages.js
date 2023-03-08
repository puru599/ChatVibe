import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatData,
  fetchGroupMessages
} from "../../ReduxStore/ActionCreators/ChatActions";
import axios from "axios";
import classes from "./Messages.module.css";
import sendMessage from "../../Assets/paper-airplane.png";
import background from "../../Assets/background1.jpg";
import openMessages from "../../Assets/openmessages.gif";
import clip from "../../Assets/paper-clip.png";
import SendFile from "./sendFileOptions";

const Messages = () => {
  const dispatch = useDispatch();

  const messageRef = useRef("");
  const sendFileRef = useRef("");
  const messagesEndRef = useRef(null);

  const messageData = useSelector((state) => state.chat.chatData);
  const friendData = useSelector((state) => state.chat.activeFriend);
  const friendActive = useSelector((state) => state.chat.friendActive);
  const groupActive = useSelector((state) => state.group.GroupActive);
  const groupData = useSelector((state) => state.group.GroupData);

  const displayName = localStorage.getItem("display");

  const { userId, userName } = JSON.parse(localStorage.getItem("userData"));

  const openSendFileHandler = (event) => {
    event.preventDefault();
    sendFileRef.current.setSendFileHandler(true);
  };

  const sendMessageHandlerF = async (event) => {
    event.preventDefault();

    const message = messageRef.current.value;
    console.log("Friend", message);

    try {
      const response = await axios.post("https://group-chat-backend-i2bd.onrender.com/chat", {
        userId,
        userName,
        message,
        toId: friendData.id,
        toName: friendData.userName
      });

      if (response.status === 200) {
        messageRef.current.value = "";
        dispatch(fetchChatData(friendData));
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessageHandlerG = async (event) => {
    event.preventDefault();

    const message = messageRef.current.value;

    await axios.post("https://group-chat-backend-i2bd.onrender.com/sendGroupMessage", {
      groupId: groupData.groupId,
      groupName: groupData.groupName,
      message: message,
      userId: userId,
      userName: userName
    });

    messageRef.current.value = "";

    dispatch(fetchGroupMessages());
  };

  const getTime = (timeData) => {
    const date = new Date(timeData);
    return date.toLocaleTimeString();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageData]);

  return friendActive | groupActive ? (
    <div className={classes.messageBlock}>
      <SendFile ref={sendFileRef} />
      <header className={classes.messageHeader}>
        <h2>{displayName}</h2>
      </header>
      <img className={classes.backImage} src={background} alt="" />
      <div className={classes.chat}>
        {messageData.length > 0 ? (
          messageData.map((message) => (
            <div
              key={Math.random()}
              className={
                message.userName === userName ? classes.me : classes.friend
              }
            >
              <span className={classes.groupUser}>
                {!friendActive &&
                  message.userName !== userName &&
                  message.userName}
              </span>
              <span className={classes.messageSpan}>{message.message}</span>
              <span className={classes.Time}>{getTime(message.createdAt)}</span>
            </div>
          ))
        ) : (
          <span className={classes.noMessages}>No New Messages</span>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={!!friendActive ? sendMessageHandlerF : sendMessageHandlerG}
        className={classes.sendMessageForm}
      >
        <input
          type="text"
          id="groupMessageId"
          placeholder="Message"
          ref={messageRef}
          required
        ></input>
        <button type="submit">
          <img
            className={classes.buttonImage}
            alt="send"
            src={sendMessage}
          ></img>
        </button>
        <button type="button" onClick={openSendFileHandler}>
          <img className={classes.buttonImage} alt="send File" src={clip}></img>
        </button>
      </form>
    </div>
  ) : (
    <img
      src={openMessages}
      alt="Open Chat"
      className={classes.openMessagesImage}
    ></img>
  );
};

export default Messages;
