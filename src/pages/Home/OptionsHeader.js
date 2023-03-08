import axios from "axios";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ChatActions } from "../../ReduxStore/ReduxSlices/ChatSlice";
import { GroupActions } from "../../ReduxStore/ReduxSlices/GroupSlice";
import classes from "./OptionsHeader.module.css";
import addUser from "../../Assets/add-user.png";
import addGroup from "../../Assets/add-group.png";
import logout from "../../Assets/power-button.png";
import logo from "../../Assets/messages.png";

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
      await axios.post("https://group-chat-backend-i2bd.onrender.com/addFriend", {
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
      await axios.post("https://group-chat-backend-i2bd.onrender.com/createGroup", {
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
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <header className={classes.headerStyle}>
      <div className={classes.logoStyle}>
        <h2>{userName}</h2>
        <img src={logo} alt="Logo" />
      </div>
      <div className={classes.rightOptions}>
        {!!openAddFriendFrom && (
          <form onSubmit={addFriendHandler}>
            <input
              id="addFriendId"
              placeholder="Enter User Name"
              type="text"
              ref={friendNameRef}
              required
            ></input>
            <button>Add</button>
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
            <button>Create</button>
          </form>
        )}
        <div className={classes.icons}>
          <img
            title="Add Friend"
            src={addUser}
            alt="Add Friend"
            onClick={openAddFriendHandler.bind(null)}
          />

          <img
            title="Create Group"
            src={addGroup}
            alt="Add Group"
            onClick={openCreateGroupHandler.bind(null)}
          />

          <img
            title="Logout"
            src={logout}
            alt="Logout"
            onClick={logoutHandler.bind(null)}
          />
        </div>
      </div>
    </header>
  );
};

export default OptionsHeader;
