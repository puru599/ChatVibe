import axios from "axios";
import React, { useDebugValue, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ChatActions } from "../../ReduxStore/ReduxSlices/ChatSlice";
import { GroupActions } from "../../ReduxStore/ReduxSlices/GroupSlice";
import classes from "./OptionsHeader.module.css";

const OptionsHeader = (props) => {
  const friendNameRef = useRef("");
  const groupNameRef = useRef("");
  const dispatch = useDispatch();

  const [openAddFriendFrom, setOpenAddFriendForm] = useState(false);
  const [openCreateGroupFrom, setCreateGroupFrom] = useState(false);

  const { userId, userName } = JSON.parse(localStorage.getItem("userData"));

  const addFriendHandler = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:5000/addFriend", {
        userId: userId,
        userName: userName,
        friendName: friendNameRef.current.value
      });
      friendNameRef.current.value = "";
      props.fetchFriendsList();
    } catch (error) {
      alert(error.response.data);
    }
  };

  const openAddFriendHandler = () => {
    setOpenAddFriendForm(() => !openAddFriendFrom);
    setCreateGroupFrom(() => false);
  };

  const createGroupHandler = async (event) => {
    event.preventDefault();

    const groupName = groupNameRef.current.value;

    try {
      await axios.post("http://localhost:5000/createGroup", {
        groupName: groupName,
        userName: userName,
        userId: userId
      });
      groupNameRef.current.value = "";
      props.fetchGroups();
    } catch (error) {
      console.log(error);
    }
  };

  const openCreateGroupHandler = () => {
    setCreateGroupFrom(() => !openCreateGroupFrom);
    setOpenAddFriendForm(false);
  };

  const logoutHandler = () => {
    dispatch(ChatActions.setIsLoggedIn(false));
    dispatch(ChatActions.setChatData([]));
    dispatch(ChatActions.setFriendsList([]));
    dispatch(ChatActions.setActiveFriend(null));
    dispatch(ChatActions.setFriendActive(null));
    dispatch(GroupActions.setGroupActive(null));
    dispatch(GroupActions.setGroupData([]));
    dispatch(GroupActions.setGroupList([]));
    localStorage.removeItem("groupData");
    localStorage.removeItem("userData");
  };

  return (
    <header className={classes.headerStyle}>
      <h3>{userName}</h3>
      <div>
        {!!openAddFriendFrom && (
          <form onSubmit={addFriendHandler}>
            <input
              id="addFriendId"
              placeholder="Enter User Name"
              type="text"
              ref={friendNameRef}
              required
            ></input>
            <button>Add Friend</button>
          </form>
        )}

        {!!openCreateGroupFrom && (
          <form onSubmit={createGroupHandler}>
            <input
              id="groupNameId"
              placeholder="Enter Group Name"
              type="text"
              ref={groupNameRef}
              required
            ></input>
            <button>Create Group</button>
          </form>
        )}
        <button onClick={openAddFriendHandler.bind(null)}>
          Click Add Friend
        </button>
        <button onClick={openCreateGroupHandler.bind(null)}>
          Click Create Group
        </button>
        <button onClick={logoutHandler.bind(null)}>Logout</button>
      </div>
    </header>
  );
};

export default OptionsHeader;
