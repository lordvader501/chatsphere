import { createSlice } from "@reduxjs/toolkit";
import { Room } from "../interfaces";


const initialState: { rooms: Room[]; } = {
  rooms: [],
};

const roomsSlice = createSlice({
  name: "myrooms",
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    editRoom: (state, action) => {
      state.rooms = state.rooms.map(room => room.roomid === action.payload.roomid ? action.payload : room);
    },
    deleteRoom: (state, action) => {
      state.rooms = state.rooms.filter((room) => room.roomid !== action.payload);
    },
    clearRooms: (state) => {
      state.rooms = [];
    },
  },
});

export const { setRooms, clearRooms, deleteRoom, editRoom } = roomsSlice.actions;

export default roomsSlice.reducer;
