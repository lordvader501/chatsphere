import React, { use, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowBigRight } from "lucide-react";
import { Message } from "@/lib/const";
import { useSelector } from "react-redux";

function ChatInputBox({
  classNames,
  handleMessage,
  socket,
  user,
}: {
  classNames?: string;
  handleMessage: (params: Message) => void;
  socket: WebSocket | null;
  user: string;
}) {
  const [message, setMessage] = useState<string>("");

  async function handleSubmit() {
    handleMessage({ type: 1, message: message, username: user });
    const chatmessage = document.getElementById("chatmessage");
    if (chatmessage) {
      setTimeout(() => {
        chatmessage.scrollTop = chatmessage.scrollHeight;
      }, 0);
    }
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 1, message: message }));
    }
    setMessage("");
  }
  return (
    <div className={cn("flex w-full gap-2 mb-4", classNames)}>
      <Textarea
        value={message}
        placeholder="Type your message here."
        className="border-4 border-solid"
        autoCorrect="off"
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
      />
      <Button
        className="rounded-full bg-blue-300 w-12 p-1"
        onClick={handleSubmit}
      >
        <ArrowBigRight width="20" />
      </Button>
    </div>
  );
}

export default ChatInputBox;
