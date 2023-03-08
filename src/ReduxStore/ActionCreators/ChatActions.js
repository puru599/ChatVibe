import { ChatActions } from "../ReduxSlices/ChatSlice";
import axios from "axios";
import { GroupActions } from "../ReduxSlices/GroupSlice";

export const fetchChatData = (friendData) => {
  const { userId } = JSON.parse(localStorage.getItem("userData"));
  return async (dispatch) => {
    try {
      const response = await axios.get("https://group-chat-backend-i2bd.onrender.com/chat", {
        headers: {
          userId: userId,
          toId: friendData.id
        }
      });

      if (response.status === 200) {
        dispatch(ChatActions.setChatData(response.data));
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchFilesData = (friendData) => {
  const { userId } = JSON.parse(localStorage.getItem("userData"));
  return async (dispatch) => {
    try {
      const response = await axios.get("https://group-chat-backend-i2bd.onrender.com/fetchFiles", {
        headers: {
          userId: userId,
          toId: friendData.id
        }
      });

      if (response.status === 200) {
        // dispatch(ChatActions.setChatData(response.data));
        console.log(response);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchGroupMessages = () => {
  const { groupId } = JSON.parse(localStorage.getItem("groupData"));

  return async (dispatch) => {
    try {
      const response = await axios.get(
        "https://group-chat-backend-i2bd.onrender.com/fetchGroupMessages",
        {
          headers: {
            groupId: groupId
          }
        }
      );
      dispatch(ChatActions.setChatData(response.data));
      dispatch(ChatActions.setFriendActive(false));
      dispatch(GroupActions.setGroupActive(true));
    } catch (error) {
      console.log(error);
    }
  };
};
