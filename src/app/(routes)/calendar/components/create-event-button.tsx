import React, { useContext } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// import GlobalContext from "../context/GlobalContext";
export default function CreateEventButton() {
  //   const { setShowEventModal } = useContext(GlobalContext);
  return (
    <Button
      //   onClick={() => setShowEventModal(true)}
      className="rounded-full flex gap-2 items-center min-w-[150px]"
    >
      <Plus size={18} />
      <span className=""> Create</span>
    </Button>
  );
}
