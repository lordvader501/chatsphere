import { createSlice } from "@reduxjs/toolkit";
import { clearRooms } from "./roomsSlice";

const initialState: { user: string; } = {
  user: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      clearRooms();
      state.user = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
