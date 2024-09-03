import { create } from 'zustand';

type UserStateCategoryType = "ai" | "finalized_setup" | "loading" | "contact_email";

type UserStateType = {
    socketConnected: boolean;
    avatar: string;
    loading: boolean;
    ai: boolean;
    finalized_setup: boolean;
    contact_email: string; 
    updateField: (category: UserStateCategoryType, value?: boolean) => void;
    updateFieldsInitially: (ai: boolean, finalized_setup: boolean, contact_email: string,  loading: boolean, avatar: string, socketConnected: boolean) => void;
}


export const userStateStore = create<UserStateType>((set, get) => ({
    ai: false,
    avatar: "",
    contact_email: "",
    finalized_setup: true,
    loading: true,
    socketConnected: false,
    updateField: (category: UserStateCategoryType, value?: boolean) => {
        set({ [category]: value || true })
    },
    updateFieldsInitially: (ai: boolean, finalized_setup: boolean, contact_email: string, loading: boolean, avatar: string, socketConnected: boolean) => {
        set({ ai })
        set({ finalized_setup });
        set({ contact_email })
        set({ loading })
        set({ avatar })
        set({ socketConnected })
    }
}))