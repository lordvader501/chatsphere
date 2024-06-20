import React, { use, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowBigRight, SendHorizontal } from "lucide-react";
import { Message } from "@/lib/interfaces";

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
    if (message.trim().length === 0) {
      setMessage("");
      return;
    }
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
    <div className={cn("flex w-full gap-2", classNames)}>
      <Textarea
        value={message}
        placeholder="Type your message here."
        className="border-2 border-solid no-scrollbar focus:outline-none"
        autoCorrect="off"
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter" && !e.shiftKey) handleSubmit();
        }}
      />
      <Button
        className="rounded-full bg-blue-300 w-12 p-1"
        onClick={handleSubmit}
      >
        <SendHorizontal width="20" />
      </Button>
    </div>
  );
}

export default ChatInputBox;
