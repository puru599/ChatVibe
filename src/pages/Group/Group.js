import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const Group = () => {
  const groupNameRef = useRef("");
  const userNameRef = useRef("");
  const groupMessageRef = useRef("");

  const [groups, setGroups] = useState([]);
  const [groupOpsVisib, setGroupOpsVisib] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [isAdminData, setIsAdminData] = useState([]);

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
      groupNameRef.current.value = "";
      fetchGroups();
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

  const openGroupOptionsHandler = async (group) => {
    const groupData = JSON.stringify(group);
    localStorage.setItem("groupData", groupData);
    await groupAdminCheck();
    await fetchGroupMembers();
    await fetchGroupMessages();
    setGroupOpsVisib(true);
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
      userNameRef.current.value = "";
      fetchGroupMembers();
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

    await axios.post("http://localhost:5000/sendGroupMessage", {
      groupId: groupId,
      groupName: groupName,
      message: message,
      userId: userId,
      userName: userName
    });
    groupMessageRef.current.value = "";
    fetchGroupMessages();
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
      // console.log(response);
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
      setGroupMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const groupAdminCheck = async () => {
    const { groupId, groupName } = JSON.parse(
      localStorage.getItem("groupData")
    );
    try {
      const response = await axios.get(
        "http://localhost:5000/groupAdminCheck",
        {
          headers: {
            groupId: groupId,
            userId: userId
          }
        }
      );
      // console.log(response.data);
      setIsAdminData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeGroupMember = async (user) => {
    const { userId, userName } = user;
    const { groupId, groupName } = JSON.parse(
      localStorage.getItem("groupData")
    );
    try {
      await axios.post("http://localhost:5000/removeGroupMember", {
        userId,
        userName,
        groupId,
        groupName
      });
      fetchGroupMembers();
    } catch (error) {
      console.log(error);
    }
  };

  const makeGroupAdmin = async (user) => {
    const { userId, userName } = user;
    const { groupId, groupName } = JSON.parse(
      localStorage.getItem("groupData")
    );
    try {
      await axios.post("http://localhost:5000/makeGroupAdmin", {
        userId,
        userName,
        groupId,
        groupName
      });
      groupAdminCheck();
      fetchGroupMembers();
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
          {isAdminData.includes(userId) && (
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
            </React.Fragment>
          )}
          <h5>Group Members:</h5>
          <ul>
            {groupMembers.map((member) => (
              <li key={Math.random()}>
                {member.userName}{" "}
                {isAdminData.includes(member.userId) ? (
                  <span> - Admin User</span>
                ) : (
                  <React.Fragment>
                    {isAdminData.includes(userId) ? (
                      <React.Fragment>
                        <button onClick={removeGroupMember.bind(null, member)}>
                          Remove
                        </button>
                        <button onClick={makeGroupAdmin.bind(null, member)}>
                          Make Admin
                        </button>
                      </React.Fragment>
                    ) : null}
                  </React.Fragment>
                )}
              </li>
            ))}
          </ul>
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
