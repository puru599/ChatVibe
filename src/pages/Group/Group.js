import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
// import Button from "../../Layout/UI/button";
// import Form from "../../Layout/UI/Form";

const Group = () => {
  const groupNameRef = useRef("");
  const userNameRef = useRef("");
  const groupMessageRef = useRef("");

  const [groups, setGroups] = useState([]);
  const [groupOpsVisib, setGroupOpsVisib] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);

  const { userId, userName } = JSON.parse(localStorage.getItem("userData"));

  const createGroupHandler = async (event) => {
    event.preventDefault();
    const groupName = groupNameRef.current.value;
    try {
      await axios.post("http://localhost:5000/createGroup", {
        groupName: groupName,
        userName: userName,
        userId: userId
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:5000/fetchGroups", {
        headers: {
          userId: userId
        }
      });
      setGroups(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const openGroupOptionsHandler = (group) => {
    setGroupOpsVisib(true);
    const groupData = JSON.stringify(group);
    localStorage.setItem("groupData", groupData);
    fetchGroupMembers();
    fetchGroupMessages();
  };

  const addGroupMember = async (event) => {
    event.preventDefault();
    const { groupId, groupName } = JSON.parse(
      localStorage.getItem("groupData")
    );
    const userName = userNameRef.current.value;
    try {
      const respone = await axios.post("http://localhost:5000/addGroupMember", {
        userName: userName,
        groupId: groupId,
        groupName: groupName
      });
      console.log(respone);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessageHandler = async (event) => {
    event.preventDefault();
    const { groupId, groupName } = JSON.parse(
      localStorage.getItem("groupData")
    );
    const message = groupMessageRef.current.value;

    const response = await axios.post(
      "http://localhost:5000/sendGroupMessage",
      {
        groupId: groupId,
        groupName: groupName,
        message: message,
        userId: userId,
        userName: userName
      }
    );
    console.log(response);
  };

  const fetchGroupMembers = async () => {
    const { groupId } = JSON.parse(localStorage.getItem("groupData"));
    try {
      const response = await axios.get(
        "http://localhost:5000/fetchGroupMembers",
        {
          headers: {
            groupId: groupId
          }
        }
      );
      setGroupMembers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGroupMessages = async () => {
    const { groupId } = JSON.parse(localStorage.getItem("groupData"));
    try {
      const response = await axios.get(
        "http://localhost:5000/fetchGroupMessages",
        {
          headers: {
            groupId: groupId
          }
        }
      );
      console.log(response);
      setGroupMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGroups();
    localStorage.setItem("groupData", null);
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={createGroupHandler}>
        <h3>Create Group</h3>
        <div>
          <input
            id="groupNameId"
            placeholder="Enter Group Name"
            type="text"
            ref={groupNameRef}
            required
          ></input>
        </div>
        <button>Create Group</button>
      </form>
      <ul>
        {groups.map((group) => (
          <button
            key={group.groupName}
            onClick={openGroupOptionsHandler.bind(null, group)}
          >
            {group.groupName}
          </button>
        ))}
      </ul>
      {!!groupOpsVisib ? (
        <React.Fragment>
          <form onSubmit={addGroupMember}>
            <input
              type="text"
              id="userNameId"
              placeholder="Enter UserName"
              ref={userNameRef}
            ></input>
            <button>Add group member</button>
          </form>
          <form onSubmit={sendMessageHandler}>
            <input
              type="text"
              id="groupMessageId"
              placeholder="Message"
              ref={groupMessageRef}
            ></input>
            <button>Send</button>
          </form>
          <div>
            <h5>Users:</h5>
            <ul>
              {groupMembers.map((member) => (
                <li key={Math.random()}>{member.userName}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Messages:</h5>
            <ul>
              {groupMessages.map((message) => (
                <li key={Math.random()}>
                  {message.userName} : {message.message}
                </li>
              ))}
            </ul>
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default Group;
