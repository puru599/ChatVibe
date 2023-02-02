import React, { Fragment, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SideBar from "../../Layout/SideBar/SideBar";
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

const Home = () => {
  const dispatch = useDispatch();
  const groupRef = useRef();
  const { userId } = JSON.parse(localStorage.getItem("userData"));
  const friendsList = useSelector((state) => state.chat.friendsList);
  const groupList = useSelector((state) => state.group.groupList);

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
      dispatch(ChatActions.setFriendsList(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const openMessagesHandler = async (friend) => {
    dispatch(ChatActions.setActiveFriend(friend));
    dispatch(fetchChatData(friend));
    dispatch(ChatActions.setFriendActive(true));
    dispatch(GroupActions.setGroupActive(false));
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:5000/fetchGroups", {
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
    const groupData = JSON.stringify(group);
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
  }, []);

  return (
    <Fragment>
      <OptionsHeader
        fetchFriendsList={fetchFriendsList}
        fetchGroups={fetchGroups}
      />
      <div className={classes.bodyStyle}>
        <header className={classes.sideBar}>
          <h3>Friends List:</h3>
          <ul>
            {friendsList.map((friend) => (
              <p
                key={friend.id}
                onClick={openMessagesHandler.bind(null, friend)}
              >
                {friend.userName}
              </p>
            ))}
          </ul>
          <h3>Groups List:</h3>
          <ul>
            {groupList.map((group) => (
              <p
                key={group.groupName}
                onClick={openGroupMessageHandler.bind(null, group)}
              >
                {group.groupName}
                <button onClick={openGroupOptionsHandler.bind(null, group)}>
                  Open Options
                </button>
              </p>
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
