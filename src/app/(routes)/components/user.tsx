"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import AppAvatar from "@/components/common/app-avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuthUser } from "@/auth/authHooks";
 
import { userStateStore } from "@/stores/user-store";

const User = () => {
  const { push } = useRouter();

  const auth = useAuthUser();
  let user = auth();

  const {avatar} = userStateStore();
  
  const [mounted, setMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true); 
 
  }, []); 

  if (!user || !mounted)
    return (
      <Button 
        disabled={true} 
        variant={"ghost"}
        className="mt-2 mb-2 py-2"  
      >
        <Skeleton className="w-9 h-9 rounded-full"/>
         
      </Button>
    );

  return (
    <Button variant={"ghost"} size="icon" className="mt-2 mb-2 py-2" onClick={() => push("/profile")}>
        <AppAvatar
            src={avatar}
            name="User"
            dimension='w-9 h-9'
        />

    </Button>
  );
};

export default User;
