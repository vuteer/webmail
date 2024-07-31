import { create } from 'zustand';

type UserStateCategoryType = "ai" | "finalized_setup" | "loading";

type UserStateType = {
    socketConnected: boolean;
    avatar: string;
    loading: boolean;
    ai: boolean;
    finalized_setup: boolean;
    updateField: (category: UserStateCategoryType, value?: boolean) => void;
    updateFieldsInitially: (ai: boolean, finalized_setup: boolean, loading: boolean, avatar: string, socketConnected: boolean) => void;
}


export const userStateStore = create<UserStateType>((set, get) => ({
    ai: false,
    avatar: "",
    finalized_setup: true,
    loading: true,
    socketConnected: false,
    updateField: (category: UserStateCategoryType, value?: boolean) => {
        set({ [category]: value || true })
    },
    updateFieldsInitially: (ai: boolean, finalized_setup: boolean, loading: boolean, avatar: string, socketConnected: boolean) => {
        set({ ai })
        set({ finalized_setup })
        set({ loading })
        set({ avatar })
        set({ socketConnected })
    }
}))