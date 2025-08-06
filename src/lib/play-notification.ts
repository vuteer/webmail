// lib/playNotification.ts
export const playNotification = () => {
  const audio = new Audio("/notification-sound.mp3"); // adjust path accordingly
  audio.play().catch((err) => {
    console.warn("Notification sound failed to play:", err);
  });
};
