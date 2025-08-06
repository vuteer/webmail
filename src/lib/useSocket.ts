// lib/useSocket.ts
import { useEffect, useRef } from "react";
import useMounted from "@/hooks/useMounted";
import { useNotificationStateStore } from "@/stores/notification-store";
import { playNotification } from "./play-notification";
import { useThreadStore } from "@/stores/threads";
import { useQueryState } from "nuqs";
import { useMailNumbersStore } from "@/stores/mail-numbers";

const RECONNECT_INTERVAL = 3000; // 3 seconds
const MAX_RECONNECT_ATTEMPTS = 15;

export const useSocket = (userId: string | null) => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const mounted = useMounted();
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const { addNotificationToState } = useNotificationStateStore();
  const { fetchThreads } = useThreadStore();
  const { setInitialNumbers } = useMailNumbersStore();

  const [sec] = useQueryState("sec");
  const [page] = useQueryState("page");

  const connect = () => {
    if (!userId || !mounted) return;

    const protocol = "wss";
    // window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(
      `${protocol}://${process.env.NEXT_PUBLIC_SOCKET_URL}?userId=${userId}`,
    );

    socket.onopen = () => {
      console.log("🔌 Connected to WebSocket server");
      reconnectAttempts.current = 0;
      // socket.send("Hello Server!");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      addNotificationToState(message);
      playNotification();
      if (message.type === "mail" && sec === "inbox") {
        setInitialNumbers();
        fetchThreads("inbox", Number(page || 0), "", false, true);
      }
    };

    socket.onclose = () => {
      console.log("❌ Disconnected from WebSocket server");
      tryReconnect();
    };

    socket.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
      socket.close(); // This will trigger `onclose`, which handles reconnection
    };

    socketRef.current = socket;
  };

  // const tryReconnect = () => {
  //   if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
  //     console.warn("⚠️ Max reconnect attempts reached");
  //     return;
  //   }

  //   reconnectTimeout.current = setTimeout(() => {
  //     console.log(
  //       `🔄 Reconnecting attempt ${reconnectAttempts.current + 1}...`,
  //     );
  //     reconnectAttempts.current += 1;
  //     connect();
  //   }, RECONNECT_INTERVAL);
  // };
  const tryReconnect = () => {
    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      console.warn("⚠️ Max reconnect attempts reached");
      return;
    }

    const delay = RECONNECT_INTERVAL * Math.pow(2, reconnectAttempts.current); // exponential backoff
    reconnectTimeout.current = setTimeout(() => {
      console.log(
        `🔄 Reconnecting attempt ${reconnectAttempts.current + 1}...`,
      );
      reconnectAttempts.current += 1;
      connect();
    }, delay);
  };
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      socketRef.current?.close();
    };
  }, [userId, mounted]);

  return socketRef;
};
