import axios from "axios";
import React, { Fragment, useState, useEffect, useRef } from "react";
import Chat from "../Chat/Chat";

const Friends = () => {
  const { userId, userName } = JSON.parse(localStorage.getItem("userData"));

  const friendNameRef = useRef("");

  const [friendsList, setFriendsList] = useState([]);
  const [activeFriendData, setActiveFriendData] = useState(null);
  const [openMessages, setOpenMessages] = useState(false);

  const fetchFriendsList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/fetchFriendsList",
        {
          headers: {
            userId: userId
          }
        }
      );
      setFriendsList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const openMessagesHandler = async (friend) => {
    setActiveFriendData(friend);
    setOpenMessages(true);
  };

  const addFriendHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/addFriend", {
        userId: userId,
        userName: userName,
        friendName: friendNameRef.current.value
      });
      friendNameRef.current.value = "";
      fetchFriendsList();
    } catch (error) {
      alert(error.response.data);
    }
  };

  useEffect(() => {
    fetchFriendsList();
  }, []);
  return (
    <Fragment>
      <form onSubmit={addFriendHandler}>
        <div>
          <input
            id="addFriendId"
            placeholder="Enter User Name"
            type="text"
            ref={friendNameRef}
            required
          ></input>
        </div>
        <button>Add Friend</button>
      </form>
      <h3>Friends List:</h3>
      <ul>
        {friendsList.map((friend) => (
          <button
            key={friend.id}
            onClick={openMessagesHandler.bind(null, friend)}
          >
            {friend.userName}
          </button>
        ))}
      </ul>
      {!!openMessages && <Chat friendData={activeFriendData} />}
    </Fragment>
  );
};

export default Friends;
