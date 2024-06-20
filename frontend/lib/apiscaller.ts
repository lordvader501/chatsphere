import { store } from "./store";
import { clearUser } from "./store/userSlice";

// logout api call
export async function logoutUserApi() {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/logout", {
    method: "Get",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok && response.status !== 401) throw Error(data.error);
  return data;
}

// login api caller
export async function loginUserApi(user: string, password: string) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/login",
    {
      method: "POST",
      body: JSON.stringify({
        username: user,
        password: password,
      }),
      credentials: "include",
    }
  );
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) store.dispatch(clearUser());
    throw Error(data.error);
  }
  return data;
}

// signup api caller
export async function signupUserApi(email: string, username: string, password: string) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/register",
    {
      method: "POST",
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
      }),
      credentials: "include",
    }
  );
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) store.dispatch(clearUser());
    throw Error(data.error);
  }
  return data;
}

// check roomid api caller
export async function checkRoomIdApi(roomid: string) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/check-roomid",
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ roomid: roomid }),
    }
  );
  if (!response.ok) {
    if (response.status === 401) store.dispatch(clearUser());
    const data = await response.json();
    throw Error(data.error);
  }
}

export async function createRoomApi(roomname: string, isPrivate: boolean = false) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/create-room",
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ roomname: roomname, is_private: isPrivate }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) store.dispatch(clearUser());
    throw Error(data.error);
  }
  return data;
}

export async function getAllRoomsApi() {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/list-rooms", {
    method: "Get",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) store.dispatch(clearUser());
    throw Error(data.error);
  }
  return data;
}

export async function deleteRoomApi(roomid: string) {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/delete-room", {
    method: "Post",
    body: JSON.stringify({ "roomid": roomid }),
    credentials: "include"
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) store.dispatch(clearUser());
    throw Error(data.error);
  }
  return data;
}

export async function editRoomApi(roomname: string, roomid: string, is_private: boolean) {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/update-room", {
    method: "Post",
    body: JSON.stringify({ roomid: roomid, roomname: roomname, is_private: is_private }),
    credentials: "include"
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) store.dispatch(clearUser());
    throw Error(data.error);
  }
  return data;
}