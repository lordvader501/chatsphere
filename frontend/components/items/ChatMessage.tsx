import { Message } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";

function ChatMessage({ messages }: { messages: Message[] }) {
  return (
    <div id="chatmessage" className="overflow-y-scroll no-scrollbar">
      {messages.map((item, idx) => {
        if (item.type !== 3)
          return (
            <div
              key={idx}
              className={cn("w-full flex flex-col", {
                "items-start": item.type === 2,
                "items-end": item.type === 1,
                "items-center": item.type === 4 || item.type === 5,
              })}
            >
              <ChatBox
                message={item.message}
                username={item.username}
                type={item.type}
              />
            </div>
          );
      })}
    </div>
  );
}

function ChatBox({
  message,
  username,
  type,
}: {
  message: string;
  username: string;
  type: number;
}) {
  return (
    <div
      className={cn("max-w-72 xs:max-w-96 flex flex-col mb-2.5", {
        "items-end": type === 1,
        "items-start": type === 2,
        "items-center": type === 4 || type === 5,
      })}
    >
      {username && <div className="text-xs px-1">@{username}</div>}
      <div
        className={cn(
          "px-4 w-[calc(100%+20px)] break-words rounded-sm py-1.5",
          {
            "bg-blue-300 pr-2.5": type === 1,
            "bg-green-300 pl-2.5": type === 2,
            "bg-slate-300 px-4 py-0.5 rounded-full text-center text-xs w-fit font-light":
              type === 4 || type === 5,
          }
        )}
      >
        {message}
      </div>
    </div>
  );
}
export default ChatMessage;
