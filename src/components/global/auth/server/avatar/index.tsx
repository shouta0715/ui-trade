import { Mail } from "lucide-react";
import { Session } from "next-auth";
import React from "react";

import { createDraftComponentWithRedirect } from "@/actions/components/create";
import { SignOutButton } from "@/components/global/auth/server/auth-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function AuthorizedAvatar({
  session,
  form = true,
}: {
  session: Session;
  form?: boolean;
}) {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="mx-2 h-8 w-8 overflow-hidden rounded-full border border-input md:h-10 md:w-10"
            variant="ghost"
          >
            <Avatar className="bg-none">
              <AvatarImage
                className="object-cover"
                src={session.user?.image ?? ""}
              />
              <AvatarFallback className="animate-pulse">
                {session.user?.name?.slice(0, 2) ?? "UN"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="z-50 flex w-60 flex-col gap-y-2 bg-popover"
          sideOffset={4}
        >
          <div className="grid gap-y-4">
            <div className="grid gap-y-1 border-b py-2">
              <p className="font-semibold">{session.user?.name ?? ""}</p>
              <p className="flex items-center  gap-x-2 text-sm text-muted-foreground ">
                <Mail className="inline-block h-4 w-4" />
                <span className="line-clamp-1 w-full flex-1">
                  {session.user?.email ?? ""}
                </span>
              </p>
            </div>

            <div className="-m-2 p-2 hover:bg-accent">
              <SignOutButton />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {form && (
        <form action={createDraftComponentWithRedirect}>
          <Button className="font-semibold" size="sm" type="submit">
            投稿する
          </Button>
        </form>
      )}
    </>
  );
}
