"use client";
import RoomInfo from "@/components/items/RoomInfo";
import Container from "@/components/layouts/Container";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { getAllRoomsApi } from "@/lib/apiscaller";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setRooms } from "@/lib/store/roomsSlice";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function RoomsPage() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async function () {
      const data = await getAllRoomsApi();
      dispatch(setRooms(data.rooms));
    })();
  }, []);
  const rooms = useAppSelector((state) => state.myrooms.rooms);
  const router = useRouter();
  return (
    <Container className={rooms.length === 0 ? "h-[calc(100vh-64px)]" : ""}>
      {rooms.length === 0 && (
        <h1 className="text-center text-2xl font-medium gap-2 h-full -mt-10 flex items-center justify-center">
          You currently don't have any rooms. Create a room at{" "}
          <Link href="/chat" className="underline text-blue-600">
            here
          </Link>
          .
        </h1>
      )}
      {rooms.map((item) => (
        <RoomInfo
          room={item}
          key={item.roomid}
          router={router}
          dispatch={dispatch}
        />
      ))}
    </Container>
  );
}

export default ProtectedRoute(RoomsPage);
