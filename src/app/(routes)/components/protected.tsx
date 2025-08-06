// protect pages

"use client";
import React, { PropsWithChildren } from "react";
import Link from "next/link";

import { Heading1, Paragraph } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

import { useSession } from "@/lib/auth-client";
import useMounted from "@/hooks/useMounted";

import Menu from "./menu";
import { cn } from "@/lib/utils";
import { images } from "@/assets";
import { AppImage } from "@/components";
import { FetchEvents } from "../calendar/components/fetch-events";
import { GetQuotas } from "./CheckUserQuotas";
import { NotificationHandler } from "@/services/notification-handler";
import Notifications from "@/components/notifications";

type ProtectedProps = PropsWithChildren<{
  title: string;
  backPage?: boolean;
  className?: string;
}>;

const Protected = ({ title, children }: ProtectedProps) => {
  const mounted = useMounted();

  const { data: session, isPending, error, refetch } = useSession();

  console.log(session);
  // ❌ Unauthorized
  if (!session?.user && !isPending) {
    return (
      <div className="animate-fade-in flex flex-1 flex-col items-center justify-center p-10">
        <div className="relative h-[500px] w-[500px] overflow-hidden rounded-lg">
          <AppImage
            src={images.unauthorized}
            title="Unauthorized"
            alt="Unauthorized"
            fill
            objectFit="cover"
            cls="h-full w-full rounded-lg object-cover"
          />
        </div>
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold text-red-600">Unauthorized</h2>
          <p className="text-muted-foreground">
            You must be logged in to view this page.
          </p>
          <Link
            href="/auth/login"
            className="inline-block rounded bg-black px-4 py-2 text-white transition hover:bg-opacity-90"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!mounted || isPending) return <Placeholder />;

  return (
    <>
      <FetchEvents />
      <GetQuotas />
      <Notifications />
      {session?.user && <NotificationHandler user={session.user.id} />}
      <div
        className={cn(
          "my-1 flex-1 h-[99vh] overflow-hidden gap-2 flex flex-col ",
          title && "bg-background rounded-xl px-4 pt-5",
        )}
      >
        {title && (
          <>
            <div className="flex justify-between items-center pl-2">
              <Heading1 className="text-lg lg:text-2xl capitalize flex-1 ">
                {title}
              </Heading1>
              <Menu other={true} />
            </div>
            <Separator />
          </>
        )}

        {children}
      </div>
    </>
  );
};

export default Protected;

// placeholder

const Placeholder = () => (
  <section className="flex-1 p-2 flex gap-2">
    {/* <Menu /> */}
    {/* <SideMenu /> */}
    <div className="flex-1 items-center justify-center bg-background rounded-lg px-2 py-4">
      <Paragraph>Loading...</Paragraph>
    </div>
  </section>
);
