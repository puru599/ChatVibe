import { createSlice } from "@reduxjs/toolkit";

const initialChatState = {
  friendsList: [],
  activeFriend: null,
  chatData: [],
  friendActive: false,
  activeFriendData: null,
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn"))
};

const ChatSlice = createSlice({
  name: "chat",
  initialState: initialChatState,
  reducers: {
    setFriendsList: (state, action) => {
      state.friendsList = action.payload;
    },
    setActiveFriend: (state, action) => {
      state.activeFriend = action.payload;
    },
    setChatData: (state, action) => {
      state.chatData = action.payload;
    },
    setFriendActive: (state, action) => {
      state.friendActive = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setActiveFriendData: (state, action) => {
      state.activeFriendData = action.payload;
    }
  }
});

export const ChatActions = ChatSlice.actions;

export default ChatSlice.reducer;
