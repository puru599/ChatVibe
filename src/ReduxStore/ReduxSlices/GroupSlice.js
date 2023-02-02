import { createSlice } from "@reduxjs/toolkit";

const initialGroupState = {
  groupList: [],
  activeGroup: null,
  GroupData: [],
  GroupActive: false
};

const GroupSlice = createSlice({
  name: "group",
  initialState: initialGroupState,
  reducers: {
    setGroupList: (state, action) => {
      state.groupList = action.payload;
    },
    setGroupActive: (state, action) => {
      state.GroupActive = action.payload;
    },
    setGroupData: (state, action) => {
      state.GroupData = action.payload;
    }
  }
});

export const GroupActions = GroupSlice.actions;

export default GroupSlice.reducer;
