export interface Message {
  type: number;
  message: string;
  username: string;
}

export interface Room {
  roomname: string;
  roomid: string;
  is_private: boolean;
}

export interface RoomParams {
  roomname: string;
  isPrivate: boolean;
  roomId: string;
}