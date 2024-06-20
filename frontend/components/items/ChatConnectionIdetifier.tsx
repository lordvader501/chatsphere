import { cn } from "@/lib/utils";
import { Wifi } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ChatConnectionIdetifier({ readystate }: { readystate: number }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "absolute top-20 right-10 rounded-xl border-2 p-1 cursor-pointer",
              {
                "bg-green-100 border-green-400": readystate === WebSocket.OPEN,
                "bg-red-100 border-red-400": readystate === WebSocket.CLOSED,
                "bg-gray-200 border-gray-400":
                  readystate === WebSocket.CONNECTING,
              }
            )}
          >
            {ChatConnection(readystate || 0)}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent(readystate || 0)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ChatConnectionIdetifier;

function ChatConnection(state: number) {
  if (state === WebSocket.OPEN) return <Wifi color="green" />;
  if (state === WebSocket.CLOSED) return <Wifi color="red" />;
  return <Wifi color="gray" />;
}
function tooltipContent(state: number) {
  if (state === WebSocket.OPEN) return "Online";
  if (state === WebSocket.CLOSED) return "Offline";
  return "Connecting...";
}
