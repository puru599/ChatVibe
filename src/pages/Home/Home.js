import React, { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import OptionsHeader from "./OptionsHeader";
import Group from "../Group/Group";
import Messages from "../Messages/Messages";
import { useDispatch } from "react-redux";
import {
  fetchChatData,
  fetchGroupMessages
} from "../../ReduxStore/ActionCreators/ChatActions";
import { GroupActions } from "../../ReduxStore/ReduxSlices/GroupSlice";
import { ChatActions } from "../../ReduxStore/ReduxSlices/ChatSlice";
import classes from "./Home.module.css";
import options from "../../Assets/setting.png";

const Home = () => {
  const dispatch = useDispatch();
  const groupRef = useRef();

  const [active, setActive] = useState(null);

  const friendsList = useSelector((state) => state.chat.friendsList);
  const groupList = useSelector((state) => state.group.groupList);

  const { userId } = JSON.parse(localStorage.getItem("userData"));

  const fetchFriendsList = async () => {
    try {
      const response = await axios.get(
        "https://group-chat-backend-i2bd.onrender.com/fetchFriendsList",
        {
          headers: {
            userId: userId
          }
        }
      );

      dispatch(ChatActions.setFriendsList(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const openMessagesHandler = async (friend) => {
    localStorage.setItem("display", friend.userName);
    setActive({ show: "friend", data: friend });
    dispatch(ChatActions.setActiveFriend(friend));
    dispatch(fetchChatData(friend));
    dispatch(ChatActions.setActiveFriendData(friend));
    dispatch(ChatActions.setFriendActive(true));
    dispatch(GroupActions.setGroupActive(false));
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get("https://group-chat-backend-i2bd.onrender.com/fetchGroups", {
        headers: {
          userId: userId
        }
      });

      dispatch(GroupActions.setGroupList(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const openGroupMessageHandler = async (group) => {
    localStorage.setItem("display", group.groupName);
    const groupData = JSON.stringify(group);
    setActive({ show: "group", data: group });
    localStorage.setItem("groupData", groupData);
    dispatch(GroupActions.setGroupData(group));
    dispatch(fetchGroupMessages());
    groupRef.current.groupAdminCheck();
    groupRef.current.fetchGroupMembers();
  };

  const openGroupOptionsHandler = () => {
    groupRef.current.setGroupOpsVisibHandler(true);
  };

  useEffect(() => {
    fetchFriendsList();
    fetchGroups();

    const interval = setInterval(() => {
      if (active !== null) {
        active.show === "friend"
          ? dispatch(fetchChatData(active.data))
          : dispatch(fetchGroupMessages());
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [active]);

  return (
    <Fragment>
      <OptionsHeader
        fetchFriendsList={fetchFriendsList}
        fetchGroups={fetchGroups}
      />
      <div className={classes.bodyStyle}>
        <header className={classes.sideBar}>
          <h3>Friends</h3>
          <ul className={classes.friendsList}>
            {friendsList.map((friend) => (
              <li
                key={friend.id}
                onClick={openMessagesHandler.bind(null, friend)}
              >
                <span>{friend.userName}</span>
              </li>
            ))}
          </ul>
          <h3>Groups</h3>
          <ul className={classes.friendsList2}>
            {groupList.map((group) => (
              <li
                key={group.groupName}
                onClick={openGroupMessageHandler.bind(null, group)}
              >
                <span>{group.groupName}</span>
                <img
                  src={options}
                  alt="Options"
                  onClick={openGroupOptionsHandler.bind(null, group)}
                />
              </li>
            ))}
          </ul>
        </header>
        <Group fetchGroups={fetchGroups} ref={groupRef} />
        <Messages />
      </div>
    </Fragment>
  );
};

export default Home;
