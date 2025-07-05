// mail container
// inbox - starred - sent - drafts - important - trash
"use client";

import { redirect } from "next/navigation";
import { useQueryState } from "nuqs";

import Mail from "./mail";
import Threads from "./threads";
const Container = () => {
  const [sec] = useQueryState("sec");

  if (!sec) {
    redirect("/?sec=inbox");
  }
  return (
    <div className="flex-1 flex gap-1 ">
      <Threads />
      <Mail />
    </div>
  );
};

export default Container;
