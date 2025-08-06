import { useEffect } from "react";
import { toast } from "sonner";
import { useSocket } from "@/lib/useSocket";

export const NotificationHandler = ({ user }: { user: string }) => {
  const socketRef = useSocket(user);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "notification") {
          console.log("📨 Notification:", data);
          toast(data.message || "You have a new notification");
        }
      } catch (err) {
        console.warn("Invalid message:", event.data);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socketRef]);

  return null;
};
