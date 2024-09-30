import { create } from 'zustand';

import {updateUserSettings} from "@/lib/api-calls/user";

type SignatureType = {
    name: string; 
    logo: string;
    title: string; 
    slogan: string; 
    address: string; 
}
export type NotificationType = {
    system: boolean; 
    events: boolean; 
    appointments: boolean; 
    news: boolean; 
}
export type SecurityType = {
    TwoFA: boolean; 
    reset: boolean; 
}
type UserPreferencesType = {
    signature: SignatureType | null; 
    notifications: NotificationType; 
    security: SecurityType; 
    addInitial: (signature: SignatureType, notifications: NotificationType, security: SecurityType) => void; 
    updateNotification: (val: keyof NotificationType) => Promise<void>; 
    updateSecurity: (val: keyof SecurityType) => Promise<void>; 
    // updateSignature
}

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
    addInitial: (signature: SignatureType, notifications: NotificationType, security: SecurityType) => {
        set({signature});
        set({notifications});
        set({security})
    },
    updateNotification: async (val: keyof NotificationType) => {
        let notifications = get().notifications;
        let current: any = notifications[val]
        set({notifications: {
                ...get().notifications, 
                [val]: !current
            }
        });
        await updateUserSettings("notifications_preferences", {[val]: !current})
    },
    updateSecurity: async (val: keyof SecurityType) => {
        let security = get().security;
        let current = security[val]
        set({security: {
                ...get().security, 
                [val]: !current
            }
        });
        await updateUserSettings("security_preferences", {[val]: !current})

    }
}))