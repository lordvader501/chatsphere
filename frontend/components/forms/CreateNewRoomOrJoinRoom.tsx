"use client";
import { CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { useState } from "react";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";
import { checkRoomIdApi, createRoomApi } from "@/lib/apiscaller";
import { useToast } from "../ui/use-toast";
import { useAppSelector } from "@/lib/store";
import { RoomParams } from "@/lib/interfaces";

function CreateNewRoomOrJoinRoom({ isCreateRoom }: { isCreateRoom: boolean }) {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const { toast } = useToast();
  const [roomParams, setRoomParams] = useState<RoomParams>({
    roomname: "",
    isPrivate: false,
    roomId: "",
  });
  async function handleRoomCreation() {
    try {
      setLoading(true);
      const roomname = roomParams.roomname;
      const isprivate = roomParams.isPrivate;
      const data = await createRoomApi(roomname, isprivate);
      toast({
        title: "Room Created",
        description: data.message,
        variant: "success",
      });
      router.push("/chat/" + data.roomid);
    } catch (e) {
      console.error(e);
      toast({
        title: "Something went wrong",
        description: e + "",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }
  async function handleRoomJoin() {
    let roomid = roomParams.roomId.replaceAll("-", "");
    try {
      setLoading(true);
      if (roomid.length !== 10)
        throw Error(
          "Room Id must be of 10 characters!! example xxx-xxxx-xxx or xxxxxxxxxx"
        );
      roomid =
        roomid.substring(0, 3) +
        "-" +
        roomid.substring(3, 7) +
        "-" +
        roomid.substring(7);
      await checkRoomIdApi(roomid);
      toast({
        description: "Joined the room " + roomid,
        variant: "success",
      });
      router.push("/chat/" + roomid);
    } catch (e) {
      console.error(e);
      toast({
        title: "Invalid Room Id",
        description: e + "",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <CardContent>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="roomname">
            {isCreateRoom ? "Room Name" : "Room Id"}
          </Label>
          <Input
            id="roomname"
            type="text"
            value={isCreateRoom ? roomParams.roomname : roomParams.roomId}
            placeholder={isCreateRoom ? "Room Name" : "Room Id"}
            required
            onChange={(e) =>
              setRoomParams(
                isCreateRoom
                  ? { ...roomParams, roomname: e.target.value }
                  : { ...roomParams, roomId: e.target.value }
              )
            }
          />
        </div>

        {isCreateRoom && (
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isprivate" className="text-sm">
                Private Room
              </Label>
              <p className="text-xs text-[hsl(215.4deg_15.55%_49.14%)]">
                Make chat room private.
              </p>
            </div>
            <Switch
              id="isprivate"
              checked={roomParams.isPrivate}
              onCheckedChange={(checked) =>
                setRoomParams({ ...roomParams, isPrivate: checked })
              }
            />
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          onClick={isCreateRoom ? handleRoomCreation : handleRoomJoin}
          disabled={!user}
        >
          {buttonText(user, loading, isCreateRoom)}
        </Button>
      </div>
    </CardContent>
  );
}

export default CreateNewRoomOrJoinRoom;

function buttonText(
  user: any,
  loading: boolean,
  isCreateRoom: boolean
): string | React.ReactNode {
  if (!user) return "Please Sign In";
  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-[18px] w-[18px] animate-spin" />
        Please wait
      </div>
    );
  if (isCreateRoom) return "Create Room";
  return "Join Room";
}
