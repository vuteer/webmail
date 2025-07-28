// more popover
import React from "react";
import Link from "next/link";

import { CalendarDays, Files, Grip, LogOut, User } from "lucide-react";

import { AppLinkButton } from "@/components";
import { Button } from "@/components/ui/button";
import PopoverContainer from "./container";
import Logout from "../modals/logout";

const MorePopover = () => {
  const [openLogoutModal, setOpenLogoutModal] = React.useState<boolean>(false);

  return (
    <>
      <Logout
        isOpen={openLogoutModal}
        onClose={() => setOpenLogoutModal(false)}
      />

      <PopoverContainer
        contentClassName="w-[200px] absolute  -right-5"
        trigger={
          <AppLinkButton type="ghost" size="sm">
            <Grip size={18} />
          </AppLinkButton>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {items.map((itm: MoreItemType, index: number) => (
            <MoreItem key={index} item={itm} />
          ))}
          <Link
            href="#"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenLogoutModal(true);
            }}
            className="mb-3 flex flex-col items-center gap-2 hover:text-destructive duration-700"
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
    href: "/calendar",
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
