import { create } from "zustand";

import { getUserSettings, updateUserSettings } from "@/lib/api-calls/settings";

type SignatureType = {
  name: string;
  logo: string;
  title: string;
  slogan: string;
  address: string;
};
export type NotificationType = {
  system: boolean;
  events: boolean;
  appointments: boolean;
  news: boolean;
};
export type SecurityType = {
  TwoFA: boolean;
  reset: boolean;
};
type UserPreferencesType = {
  signature: SignatureType | null;
  notifications: NotificationType;
  security: SecurityType;
  addInitialSeettings: () => Promise<void>;
  updateNotification: (val: keyof NotificationType) => Promise<void>;
  // updateSecurity: (val: keyof SecurityType) => Promise<void>;
  // updateSignature
};

export const userPreferencesStore = create<UserPreferencesType>((set, get) => ({
  signature: null,
  notifications: {
    system: true,
    events: true,
    appointments: true,
    news: true,
  },
  security: {
    TwoFA: true,
    reset: true,
  },
  addInitialSeettings: async () => {
    const rs = await getUserSettings();

    if (rs.settings) {
      set({ notifications: rs.settings });
    } else {
      // update here
      updateUserSettings({
        settings: {
          system: true,
          events: true,
          appointments: true,
          news: true,
        },
      });
      set({
        notifications: {
          system: true,
          events: true,
          appointments: true,
          news: true,
        },
      });
    }
    if (rs.signature) {
      set({ signature: rs.signature });
    }
  },
  updateNotification: async (val: keyof NotificationType) => {
    let notifications = get().notifications;
    let current: any = notifications[val];
    set({
      notifications: {
        ...get().notifications,
        [val]: !current,
      },
    });
    await updateUserSettings({
      settings: { ...get().notifications, [val]: !current },
    });
  },
  // updateSecurity: async (val: keyof SecurityType) => {
  //   let security = get().security;
  //   let current = security[val];
  //   set({
  //     security: {
  //       ...get().security,
  //       [val]: !current,
  //     },
  //   });
  //   await updateUserSettings("security_preferences", { [val]: !current });
  // },
}));
