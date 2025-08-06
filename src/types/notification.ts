type NotificationType = {
  type: "mail" | "status" | "event" | "appointment" | "storage";
  id: string;
  title: string;
  message: string;
  url?: string;
};

export default NotificationType;
