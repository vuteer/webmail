// protect pages

"use client";
import React, { PropsWithChildren, useState } from "react";
import Link from "next/link";

import {
  Heading1,
  Heading2,
  Heading3,
  Paragraph,
} from "@/components/ui/typography";
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
import { PasswordInput } from "@/auth/forms/auth-components/Password";
import { Button } from "@/components/ui/button";
import { createToast } from "@/utils/toast";
import { Copyright } from "lucide-react";
import { updateUserPassword } from "@/lib/api-calls/user";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import FinalizeSetup from "@/components/utils/setup";

type ProtectedProps = PropsWithChildren<{
  title: string;
  backPage?: boolean;
  className?: string;
}>;

const Protected = ({ title, children }: ProtectedProps) => {
  const mounted = useMounted();

  const { data: session, isPending, error, refetch } = useSession();
  const user: any = session?.user;
  const first_password = user?.first_password;

  const first_password_changed_at: any =
    user?.first_password_changed_at || new Date();
  const date = new Date(first_password_changed_at);
  // Add 30 days
  date.setDate(date.getDate() + 30);
  const now = new Date();
  const timePassed = now.getTime() > date.getTime();
  const { push } = useRouter();

  // updating password to something user centered.
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

  //  first time password / Change
  const handleChangePassword = async () => {
    if (!password || !confirmPassword || !currentPassword) {
      createToast("Input Error", "Fields cannot be empty", "danger");
      return;
    }
    if (password !== confirmPassword) {
      createToast("Input Error", "Passwords do not match", "danger");
      return;
    }
    if (password === currentPassword) {
      createToast(
        "Input Error",
        "Password should not match to current one.",
        "danger",
      );
      return;
    }

    setLoading(true);
    try {
      await updateUserPassword({
        currentPassword,
        newPassword: password,
      });
      createToast("Update", "Password updated. Login again!", "success");
      signOut();
      push("/auth/login");
    } catch (error: any) {
      createToast("Error", error?.message || "Internal Server Error", "danger");
    } finally {
      setLoading(false);
    }
  };

  if (!isPending && user && (first_password || timePassed)) {
    return (
      <div className="py-7 bg-background flex flex-col items-center justify-center w-screen h-screen">
        <div className="flex-1 max-w-2xl mx-auto space-y-5 flex flex-col justify-center">
          <Heading2 className="text-center">Update Password.</Heading2>
          <Separator />
          <Paragraph className="text-center max-w-[80%]">
            To ensure your account security, please change your password to
            something more secure.
          </Paragraph>
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            setValue={setCurrentPassword}
            loading={loading}
          />
          <PasswordInput
            label="New Password"
            value={password}
            setValue={setPassword}
            loading={loading}
          />
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            loading={loading}
          />

          <Button
            onClick={handleChangePassword}
            disabled={loading}
            className="w-full"
          >
            Change Password{loading ? "..." : ""}
          </Button>
        </div>
        <div>
          <Heading3 className="text-sm lg:text-md text-center flex gap-3 items-center">
            <Copyright size={18} />
            <span>VuMail. {new Date().getFullYear()}</span>
          </Heading3>
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
      <FinalizeSetup />
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
