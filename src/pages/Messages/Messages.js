import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatData,
  fetchGroupMessages
} from "../../ReduxStore/ActionCreators/ChatActions";
import axios from "axios";

const Messages = () => {
  const dispatch = useDispatch();
  const messageRef = useRef("");
  const messageData = useSelector((state) => state.chat.chatData);
  const friendData = useSelector((state) => state.chat.activeFriend);
  const friendActive = useSelector((state) => state.chat.friendActive);
  const groupActive = useSelector((state) => state.group.GroupActive);
  const groupData = useSelector((state) => state.group.GroupData);
  const [file, setFile] = useState(null);
  const { userId, userName } = JSON.parse(localStorage.getItem("userData"));

  const sendMessageHandlerF = async (event) => {
    event.preventDefault();

    const message = messageRef.current.value;
    console.log("Friend", message);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
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
    console.log("Group", message);
    await axios.post("http://localhost:5000/sendGroupMessage", {
      groupId: groupData.groupId,
      groupName: groupData.groupName,
      message: message,
      userId: userId,
      userName: userName
    });

    messageRef.current.value = "";
    dispatch(fetchGroupMessages());
  };

  const openFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const sendFileHandler = (event) => {
    event.preventDefault();
    console.log(file);
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      sendFileAxios(e.target.result);
    };
    const sendFileAxios = async (fileUrl) => {
      try {
        console.log(fileUrl);
        const response = await axios.post("http://localhost:5000/sendFile", {
          fileUrl: fileUrl,
          fileName: file.name,
          userId: userId,
          userName: userName,
          toId: friendData.id,
          toName: friendData.userName
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
  };

  return friendActive | groupActive ? (
    <div>
      <h5>Messages:</h5>
      <ul>
        {messageData.map((message) => (
          <li key={Math.random()}>
            {message.userName} : {message.message}
          </li>
        ))}
      </ul>
      <form
        onSubmit={!!friendActive ? sendMessageHandlerF : sendMessageHandlerG}
      >
        <input
          type="text"
          id="groupMessageId"
          placeholder="Message"
          ref={messageRef}
        ></input>
        <button>Send</button>
      </form>
      {!!friendActive && (
        <form onSubmit={sendFileHandler}>
          <input type="file" name="file" onChange={openFileUpload}></input>
          <button>Send File</button>
        </form>
      )}
    </div>
  ) : (
    <span>Open Messages</span>
  );
};

export default Messages;
