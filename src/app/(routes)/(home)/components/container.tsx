// mail container
// inbox - starred - sent - drafts - important - trash
"use client";

import Mail from "./mail";
import Threads from "./threads";

const Container = ({ sec }: { sec: string }) => {
  return (
    <div className="flex-1 flex gap-1 ">
      <Threads title={sec} />
      <Mail />
    </div>
  );
};

export default Container;
