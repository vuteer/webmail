// side menu
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlignJustify,
  // CalendarDays,
  CircleAlert,
  // CircleUser,
  // Clock,
  File,
  // Files,
  Inbox,
  Send,
  Archive,
  Trash2,
  // Pencil,
  SquarePen,
  X,
  ArrowUpFromLine,
  FileText,
  CalendarDays,
  Files,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "@/helpers/local-storage";
import { useSearch } from "@/hooks/useSearchParams";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import useMounted from "@/hooks/useMounted";
import { Paragraph } from "@/components/ui/typography";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/useMobile";
import { EmailCompose } from "@/components/editor/compose";
import { sendingMail } from "@/components/editor/compose/send";

const SideMenu = () => {
  const params = useSearch();
  const pathname = usePathname();

  const { data: session } = useSession();
  const mounted = useMounted();

  const sec = params?.get("sec");

  const [opened, setOpened] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!mounted) return;
    let menu_open = getLocalStorageItem("menu");

    if (!menu_open) setOpened(false);
    else {
      if (menu_open === "yes") setOpened(true);
      else setOpened(false);
    }
  }, [mounted]);

  const handleMenuOpen = () => {
    setOpened(!opened);
    setLocalStorageItem("menu", opened ? "no" : "yes");
  };

  if (!mounted) return null;

  return (
    <>
      {session?.user && !pathname.includes("auth") && (
        <nav
          className={cn(
            "duration-500 bg-secondary  py-3  h-[100vh] pb-8 flex flex-col",
            opened ? "min-w-[200px] px-5" : "px-3",
          )}
        >
          <span className="flex items-center gap-2">
            <Button variant="secondary" size="icon" onClick={handleMenuOpen}>
              <AlignJustify size={18} />
            </Button>
            {opened && (
              <span className="font-bold text-lg lg:text-3xl">Vu.Mail</span>
            )}
          </span>
          <Separator className="my-3 bg-secondary" />
          <ComposeButton sidemenuOpen={opened} />
          <Separator className="my-3 bg-secondary" />

          <div className="flex-1">
            {opened ? (
              <Paragraph className="ml-2 text-muted-foreground my-5 font-bold">
                Core
              </Paragraph>
            ) : null}
            {core.map((itm, index) => (
              <MenuItem
                item={itm}
                key={index}
                menuOpen={opened}
                current={pathname === "/" ? sec || "inbox" : pathname}
              />
            ))}
            <Separator className="my-3  bg-secondary" />
            {opened ? (
              <Paragraph className="ml-2 text-muted-foreground my-5 font-bold">
                Management
              </Paragraph>
            ) : null}
            {management.map((itm, index) => (
              <MenuItem
                item={itm}
                key={index}
                menuOpen={opened}
                current={pathname === "/" ? sec || "inbox" : pathname}
              />
            ))}
            <Separator className="my-5 bg-background" />
            {opened ? (
              <Paragraph className="ml-2 text-muted-foreground my-5 font-bold">
                Utilities
              </Paragraph>
            ) : null}
            {more.map((itm, index) => (
              <MenuItem
                item={itm}
                key={index}
                menuOpen={opened}
                current={pathname === "/" ? sec || "inbox" : pathname}
              />
            ))}
          </div>
        </nav>
      )}
    </>
  );
};

export default SideMenu;

// menu items

type MenuItemType = {
  text: string;
  icon: React.ReactNode;
  href: string;
};

let hover =
  "duration-500 hover:text-main-color hover:bg-main-bg hover:border-l-main-color";

const MenuItem = ({
  item,
  menuOpen,
  current,
}: {
  item: MenuItemType;
  menuOpen: boolean;
  current: string;
}) => (
  <Link
    href={item.href}
    className={cn(
      current && item.href.includes(current)
        ? "bg-main-bg border-l-main-color text-main-color"
        : "border-l-transparent",
      "text-sm lg:text-md border-l-2  duration-700 my-2 px-2 py-2 flex gap-2 items-center",
      hover,
    )}
  >
    {item.icon}
    <span className={cn(!menuOpen ? "hidden" : "", "")}>{item.text}</span>
  </Link>
);

const core: MenuItemType[] = [
  { text: "Inbox", icon: <Inbox size={18} />, href: "/?sec=inbox" },
  { text: "Drafts", icon: <FileText size={18} />, href: "/?sec=drafts" },
  // { text: "Outbox", icon: <ArrowUpFromLine size={18} />, href: "/?sec=outbox" },
  { text: "Sent", icon: <Send size={18} />, href: "/?sec=sent" },
];

const management: MenuItemType[] = [
  { text: "Archive", icon: <Archive size={18} />, href: "/?sec=archive" },
  {
    text: "Spam",
    icon: <CircleAlert size={18} />,
    href: "/?sec=junk",
  },
  { text: "Trash", icon: <Trash2 size={18} />, href: "/?sec=trash" },
];

const more: MenuItemType[] = [
  // { text: "Appointments", icon: <Clock size={18} />, href: "/appointments" },
  { text: "Calendar", icon: <CalendarDays size={18} />, href: "/calendar" },
  // { text: "Contacts", icon: <CircleUser size={18} />, href: "/contacts" },
  { text: "Files", icon: <Files size={18} />, href: "/files" },
];

export function ComposeButton({ sidemenuOpen }: { sidemenuOpen: boolean }) {
  const { data: session } = useSession();
  const user = session?.user;
  const isMobile = useIsMobile();

  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDialogOpen(false);
    } else {
      setDialogOpen(true);
    }
  };

  const handleSend = async (data: any) => {
    // Implement send logic here

    if (!user) return;
    const sendingUser: { email: string; name: string; image: any } = {
      email: user.email,
      name: user.name,
      image: user.image,
    };
    const res = await sendingMail(data, sendingUser);
    if (res) setDialogOpen(false);
    return res;
  };
  return (
    <Dialog open={!!dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogDescription></DialogDescription>

      <DialogTrigger asChild>
        <Button
          size={isMobile || !sidemenuOpen ? "sm" : "default"}
          className="relative mb-1.5 inline-flex lg:gap-4 items-center justify-center gap-1 self-stretch overflow-hidden rounded-lg"
        >
          {!sidemenuOpen ? (
            <SquarePen
              size={18}
              className="fill-iconLight dark:fill-iconDark mt-0.5"
            />
          ) : (
            <div className="flex items-center justify-center gap-2.5 pl-0.5 pr-1">
              <SquarePen
                size={18}
                className="fill-iconLight dark:fill-iconDark"
              />
              <div className="justify-start text-sm leading-none">
                <Paragraph className="font-semibold">New Email</Paragraph>
              </div>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-screen w-screen flex flex-col items-center justify-center max-w-none border-none bg-white/40 dark:bg-black/40 backdrop-blur-md p-0 shadow-none">
        {/* <DialogContent className="h-screen w-screen flex flex-col items-center justify-center max-w-none border-none bg-[#FAFAFA] bg-blur p-0 shadow-none dark:bg-[#141414]"> */}
        <div className="max-w-[750px] mx-auto  w-full">
          <DialogClose asChild className="flex">
            <Button size={"sm"} className="flex items-center gap-1 rounded-lg ">
              <X size={18} />
              <span className="text-sm font-medium">Esc</span>
            </Button>
          </DialogClose>
        </div>
        {/* <CreateEmail /> */}
        <div className="border rounded-2xl max-w-[750px] mx-auto w-full">
          <EmailCompose
            editorClassName="min-h-[150px]"
            onSendEmail={(data) => handleSend(data)}
            initialMessage={""}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
