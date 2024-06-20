import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { UsersRound, X } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

function ChatUsersLists({ members }: { members: string[] }) {
  const [showUsers, setShowUsers] = useState(false);
  return (
    <div className="relative">
      {showUsers && (
        <ScrollArea className="!absolute z-10 bottom-12 left-1/2 -translate-x-1/2 h-64 w-48 p-4 bg-white border-2 rounded-md md-4">
          <X
            className="absolute right-2 top-2 w-4 z-10 cursor-pointer hover:opacity-70"
            onClick={() => setShowUsers(false)}
          />
          <h4 className="mb-4 text-sm font-medium leading-none">Users</h4>
          {members.map((member) => (
            <>
              <p key={member} className="text-xs break-words">
                {member}
              </p>
              <Separator className="my-2" />
            </>
          ))}
        </ScrollArea>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="relative rounded-full w-10 h-10 p-1"
              onClick={() => setShowUsers(!showUsers)}
            >
              <UsersRound color="white" />
              <span className="absolute -top-1 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {members.length}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Show active users</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default ChatUsersLists;
