"use client";
import ChatInputBox from "@/components/items/ChatInputBox";
import ChatMessage from "@/components/items/ChatMessage";
import Container from "@/components/layouts/Container";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { Message } from "@/lib/const";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ChatPage() {
  const roomid = useSearchParams().get("room");
  if (!roomid) return <Container>Invalid Room</Container>;
  const [websocket, setSocket] = useState<WebSocket | null>(null);
  const [members, setMembers] = useState<string[]>([]);
  const user = useSelector((state) => (state as any).user.user);
  useEffect(() => {
    const ws = new WebSocket(process.env["WS_URL"] + roomid);

    ws.onopen = () => {
      console.log("Connected to the WebSocket server");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 3) {
        setMembers(message.message);
        return;
      }
      if (message.username !== user) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from the WebSocket server");
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);
  const [messages, setMessages] = useState<Message[]>([]);
  function handleMessage(message: Message) {
    setMessages([...messages, message]);
  }
  return (
    <Container className="py-0 h-[calc(100vh-64px)] flex flex-col justify-end">
      <ChatMessage messages={messages} />
      <div className="flex items-center justify-center mt-6">
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
