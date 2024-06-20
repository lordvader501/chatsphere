"use client";

import { Room, RoomParams } from "@/lib/interfaces";
import { Label } from "../ui/label";
import Heading3 from "../texts/Heading3";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LogIn, Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { deleteRoomApi, editRoomApi } from "@/lib/apiscaller";
import { deleteRoom, editRoom } from "@/lib/store/roomsSlice";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { useAppSelector } from "@/lib/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

function RoomInfo({
  room,
  router,
  dispatch,
}: {
  room: Room;
  router: AppRouterInstance;
  dispatch: any;
}) {
  const { toast } = useToast();
  const editvalue = useAppSelector((state) =>
    state.myrooms.rooms.filter((item: any) => item.roomid === room.roomid)
  );
  const [openEditMenu, setOpenEditMenu] = useState(false);
  const [editDetails, setEditDetails] = useState<Omit<RoomParams, "roomId">>({
    roomname: room.roomname,
    isPrivate: room.is_private,
  });
  function handleRoomJoin() {
    router.push("/chat/" + room.roomid);
  }
  async function handleRoomEdit() {
    try {
      const data = await editRoomApi(
        editDetails.roomname,
        room.roomid,
        editDetails.isPrivate
      );
      dispatch(
        editRoom({
          ...room,
          is_private: editDetails.isPrivate,
          roomname: editDetails.roomname,
        })
      );
      toast({
        description: data.message,
        variant: "success",
      });
    } catch (e) {
      console.error(e);
      toast({
        description: e + "",
        variant: "error",
      });
    }
  }
  async function handleRoomDelete() {
    try {
      const data = await deleteRoomApi(room.roomid);
      dispatch(deleteRoom(room.roomid));
      toast({
        description: data.message,
        variant: "success",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Unable to delete room",
        description: e + "",
        variant: "error",
      });
    }
  }
  const buttons = [
    {
      tooltip: "Join Room",
      icon: <LogIn />,
      variant: "ghost",
      onclick: handleRoomJoin,
      classname: "",
    },
    {
      tooltip: "Edit",
      icon: <Pencil />,
      variant: "ghost",
      onclick: () => setOpenEditMenu(!openEditMenu),
      classname: "",
    },
    {
      tooltip: "Join Room",
      icon: <Trash2 color="red" />,
      variant: "outline",
      onclick: handleRoomDelete,
      classname: "hover:bg-red-600/10",
      isDelete: true,
    },
  ];
  return (
    <div className="flex flex-col rounded-lg border pt-4 mb-4">
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between px-4 pb-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <Heading3 text={"Room Name: " + room.roomname} />
            <Badge className="ml-4">
              {room.is_private ? "private" : "public"}
            </Badge>
          </div>
          <p className="text-zinc-600">Room Id: {room.roomid}</p>
        </div>
        <div className="flex justify-end w-full xs:w-auto">
          <TooltipProvider>
            {buttons.map((item, idx) => (
              <Tooltip>
                <TooltipTrigger asChild>
                  {!item.isDelete ? (
                    <Button
                      variant={item.variant as "ghost" | "outline"}
                      onClick={item.onclick}
                      className={item.classname}
                    >
                      {item.icon}
                    </Button>
                  ) : (
                    <DialogButton
                      title="Do you want to delete this room?"
                      description="This action cannot be undone. This will permanently delete this room."
                      variant="outline"
                      handleClick={item.onclick}
                      icon={item.icon}
                      className={item.classname}
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
      {openEditMenu && (
        <div className="flex justify-between bg-slate-400/20 flex-col md:flex-row items-start md:items-center rounded-b-lg border p-4 gap-4">
          <div className="flex flex-col xs:flex-row w-full gap-4">
            <div className="sm:w-1/2">
              <Label>Room Name</Label>
              <Input
                type="text"
                value={editDetails.roomname}
                onChange={(e) =>
                  setEditDetails({ ...editDetails, roomname: e.target.value })
                }
              />
            </div>
            <div className="flex flex-row items-center justify-between gap-4">
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
                checked={editDetails.isPrivate}
                onCheckedChange={(checked) => {
                  setEditDetails({ ...editDetails, isPrivate: checked });
                }}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <DialogButton
              handleClick={handleRoomEdit}
              title="Confirm"
              description="Do you want to commit the changes to this room?"
              icon="Save"
              variant="default"
              className=""
              key={room.roomid}
            />
            <Button
              onClick={() => setOpenEditMenu(false)}
              variant="destructive"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomInfo;

function DialogButton({
  title,
  description,
  variant,
  handleClick,
  icon,
  className,
}: {
  title: string;
  description: string;
  variant:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  handleClick: () => void;
  icon: JSX.Element | string;
  className?: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant} className={className}>
          {icon}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
