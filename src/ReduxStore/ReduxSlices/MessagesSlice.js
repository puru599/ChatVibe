import { createSlice } from "@reduxjs/toolkit";

const initialMessageState = {
  active: null,
  messages: []
};

const MessagesSlice = createSlice({
  name: "messages",
  initialState: initialMessageState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    }
  }
});

export const MessagesActions = MessagesSlice.actions;

export default MessagesSlice.reducer;
