// more popover
import React from "react";
import Link from "next/link";

import { CalendarDays, Cog, Files, Grip, LogOut, User } from "lucide-react";

import { AppAvatar, AppLinkButton } from "@/components";

import PopoverContainer from "./container";
import Logout from "../modals/logout";
import { useSession } from "@/lib/auth-client";
import { Separator } from "../ui/separator";

const MorePopover = () => {
  const [openLogoutModal, setOpenLogoutModal] = React.useState<boolean>(false);
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <>
      <Logout
        isOpen={openLogoutModal}
        onClose={() => setOpenLogoutModal(false)}
      />

      <PopoverContainer
        contentClassName="w-[150px] absolute  -right-5"
        trigger={
          <AppAvatar
            name={user?.name || "N"}
            src={user?.image || ""}
            dimension="w-7 h-7"
          />
        }
      >
        <div className="flex flex-col gap-3">
          <Link
            href="/profile"
            className="flex items-center gap-2 hover:text-main-color"
          >
            <User size={18} />
            <span className="text-xs">Account</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2 hover:text-main-color"
          >
            <Cog size={18} />
            <span className="text-xs">Settings</span>
          </Link>

          <Separator className="my-0" />
          <Link
            href="#"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenLogoutModal(true);
            }}
            className="mb-3 flex items-center gap-2 hover:text-destructive duration-700"
          >
            <LogOut size={18} />
            <span className="text-xs">Logout</span>
          </Link>
        </div>
      </PopoverContainer>
    </>
  );
};

export default MorePopover;

// files, calendar, contacts, account, logout
const items: MoreItemType[] = [
  {
    title: "Account",
    href: "/profile",
    icon: <User size={18} />,
  },
  {
    title: "Calendar",
    href: "/calendar?cal=week",
    icon: <CalendarDays size={18} />,
  },
  // {
  //     title: "Contacts",
  //     href: "/contacts",
  //     icon: <Contact size={18}/>
  // },
  {
    title: "Files",
    href: "/files",
    icon: <Files size={18} />,
  },
  // {
  //     title: "Logout",
  //     href: "/logout",
  //     icon: <LogOut size={18}/>
  // }
];

type MoreItemType = {
  title: string;
  icon?: React.ReactNode;
  href: string;
};

const MoreItem = ({ item }: { item: MoreItemType }) => {
  return (
    <Link
      href={item.href}
      title={item.title}
      className="mb-3 flex flex-col items-center gap-2 hover:text-main-color duration-700"
    >
      {item.icon && item.icon}
      <span className="text-xs">{item.title}</span>
    </Link>
  );
};
