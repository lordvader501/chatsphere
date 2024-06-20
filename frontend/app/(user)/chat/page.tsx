import CreateNewRoomOrJoinRoom from "@/components/forms/CreateNewRoomOrJoinRoom";
import Container from "@/components/layouts/Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
function ChatHomePage() {
  const createRoomDetails = {
    title: "Create a new room",
    description:
      "Fill in the requeired details for creating a new room to chat.",
  };
  const joinRoomDetails = {
    title: "Join a Room",
    description:
      "Fill in the room ID of the room that you want to join and chat.",
  };
  return (
    <Container>
      <div className="flex gap-4 mb-10">
        <Link href="#createroom">
          <Button>Create New Room</Button>
        </Link>
        <Link href="#joinroom">
          <Button>Join Room</Button>
        </Link>
      </div>
      <Card className="mx-auto max-w-sm mb-10" id="createroom">
        <CardHeader>
          <CardTitle className="text-2xl">{createRoomDetails.title}</CardTitle>
          <CardDescription>{createRoomDetails.description}</CardDescription>
        </CardHeader>
        <CreateNewRoomOrJoinRoom isCreateRoom={true} />
      </Card>
      <Card className="mx-auto max-w-sm" id="joinroom">
        <CardHeader>
          <CardTitle className="text-2xl">{joinRoomDetails.title}</CardTitle>
          <CardDescription>{joinRoomDetails.description}</CardDescription>
        </CardHeader>
        <CreateNewRoomOrJoinRoom isCreateRoom={false} />
      </Card>
    </Container>
  );
}

export default ChatHomePage;
