import axios from "axios";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import ReactDOM from "react-dom";
import classes from "./groupOptions.module.css";

const Group = forwardRef((props, ref) => {
  const id = document.getElementById("openGroupOptionsModal");

  const userNameRef = useRef("");

  const [groupOpsVisib, setGroupOpsVisib] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isAdminData, setIsAdminData] = useState([]);

  const { userId } = JSON.parse(localStorage.getItem("userData"));

  useImperativeHandle(ref, () => {
    return {
      fetchGroupMembers: fetchGroupMembers,
      groupAdminCheck: groupAdminCheck,
      setGroupOpsVisibHandler: setGroupOpsVisibHandler
    };
  });

  const setGroupOpsVisibHandler = (bool) => {
    setGroupOpsVisib(bool);
  };

  const addGroupMember = async (event) => {
    event.preventDefault();

    const { groupId, groupName } = JSON.parse(
      localStorage.getItem("groupData")
    );
    const userName = userNameRef.current.value;

    try {
      await axios.post("http://localhost:5000/addGroupMember", {
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

  const groupAdminCheck = async () => {
    const { groupId } = JSON.parse(localStorage.getItem("groupData"));

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

  const Backdrop = () => {
    const onClose = () => {
      setGroupOpsVisib(false);
    };
    return <div className={classes.backdrop} onClick={onClose}></div>;
  };

  const Overlay = () => {
    return (
      <div className={classes.modal}>
        {isAdminData.includes(userId) && (
          <React.Fragment>
            <form onSubmit={addGroupMember}>
              <input
                type="text"
                id="userNameId"
                placeholder="Enter UserName"
                ref={userNameRef}
                required
              ></input>
              <button>Add group member</button>
            </form>
          </React.Fragment>
        )}
        <h5>Group Members</h5>
        <ul className={classes.membersList}>
          {groupMembers.map((member) => (
            <li key={Math.random()}>
              {member.userName}{" "}
              {isAdminData.includes(member.userId) ? (
                <span> - Admin</span>
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
      </div>
    );
  };

  useEffect(() => {
    localStorage.setItem("groupData", null);
  }, []);

  return (
    <React.Fragment>
      {!!groupOpsVisib ? (
        <React.Fragment>
          {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, id)}
          {ReactDOM.createPortal(<Overlay>{props.children}</Overlay>, id)}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
});

export default Group;
