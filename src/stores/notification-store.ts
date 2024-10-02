import { create } from 'zustand';

import {NotificationType} from "@/types"

type NotificationStoreState = {
    notifications: NotificationType[]; 
    addNotificationToState: (data: NotificationType, audioRef: React.RefObject<HTMLButtonElement>) => void; 
    removeNotificationFromState: (data: NotificationType) => void; 
    clearNotifications: () => void; 
}


export const useNotificationStateStore = create<NotificationStoreState>((set, get) => ({
    notifications: [],
    addNotificationToState: (data: NotificationType, audioRef: React.RefObject<HTMLButtonElement>) => {
        let {notifications} = get(); 
        let filter = notifications.filter(not => not.id === data.id); 

        if (filter.length === 0) {
            let newList = [...notifications, data]; 
            set({notifications: newList}); 

            if (audioRef.current) {
                audioRef.current?.click(); 
            }

        }
    },
    removeNotificationFromState: (data: NotificationType) => {
        let {notifications} = get(); 

        let list = notifications.filter(doc => doc.id !== data.id); 
        set({notifications: list})
    },

    clearNotifications: () => {
        set({notifications: []})
    }

}))