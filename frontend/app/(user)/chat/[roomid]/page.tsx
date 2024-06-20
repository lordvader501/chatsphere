"use client";
import ChatConnectionIdetifier from "@/components/items/ChatConnectionIdetifier";
import ChatInputBox from "@/components/items/ChatInputBox";
import ChatMessage from "@/components/items/ChatMessage";
import ChatUsersLists from "@/components/items/ChatUsersLists";
import Container from "@/components/layouts/Container";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { checkRoomIdApi } from "@/lib/apiscaller";
import { Message } from "@/lib/interfaces";
import { useAppSelector } from "@/lib/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface Params {
  params: {
    roomid: string;
  };
}

function ChatPage({ params: { roomid } }: Params) {
  const router = useRouter();
  const [websocket, setSocket] = useState<WebSocket | null>(null);
  const [members, setMembers] = useState<string[]>([]);
  const user = useAppSelector((state) => state.user.user);
  const wsref = useRef<WebSocket | null>(null);
  useEffect(() => {
    (async function () {
      try {
        await checkRoomIdApi(roomid);
      } catch (error) {
        console.error(error);
        router.push("/chat");
      }
    })();
    if (!wsref.current) {
      wsref.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL + roomid);

      wsref.current.onopen = () => {
        console.log("Connected to the WebSocket server");
        setSocket(wsref.current);
      };

      wsref.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 3) {
          setMembers(message.message);
          return;
        }
        if (message.username !== user) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      };

      wsref.current.onclose = () => {
        console.log("Disconnected from the WebSocket server");
        setSocket(null);
      };

      wsref.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
    return () => {
      if (wsref.current && wsref.current.readyState === WebSocket.OPEN) {
        wsref.current.close();
      }
    };
  }, []);
  const [messages, setMessages] = useState<Message[]>([]);
  function handleMessage(message: Message) {
    setMessages([...messages, message]);
  }
  return (
    <Container className="py-0 h-[calc(100vh-64px)] flex flex-col justify-end">
      <ChatConnectionIdetifier readystate={websocket?.readyState || 0} />
      <ChatMessage messages={messages} />
      <div className="flex items-center justify-center mt-6 gap-4 mb-4">
        <ChatUsersLists members={members} />
        <ChatInputBox
          classNames="max-w-[500px]"
          handleMessage={handleMessage}
          socket={websocket}
          user={user}
        />
      </div>
    </Container>
  );
}
export default ProtectedRoute(ChatPage);
