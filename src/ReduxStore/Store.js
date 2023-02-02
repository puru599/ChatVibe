import { configureStore } from "@reduxjs/toolkit";
import ChatSlice from "./ReduxSlices/ChatSlice";
import GroupSlice from "./ReduxSlices/GroupSlice";
import MessagesSlice from "./ReduxSlices/MessagesSlice";

const Store = configureStore({
  reducer: { chat: ChatSlice, group: GroupSlice, messges: MessagesSlice }
});

export default Store;
