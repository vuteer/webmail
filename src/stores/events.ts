import { getEvents } from "@/lib/api-calls/events";
import { EventType } from "@/types";
import { create } from "zustand";

// events, setEvents, updateEvent, appendEvent, deleteEvent
//
//
type EventStateType = {
  eventsLoading: boolean;
  events: EventType[];
  setEvents: (
    calendar?: string,
    startDate?: Date,
    endDate?: Date,
  ) => Promise<void>;
  updateEvent: (id: string, event: EventType) => Promise<void>;
  appendEvent: (event: EventType) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
};

export const eventStateStore = create<EventStateType>((set, get) => ({
  eventsLoading: true,
  events: [],
  setEvents: async (calendar?: string, startDate?: Date, endDate?: Date) => {
    set({ events: [], eventsLoading: true });
    const rs = await getEvents();

    set({ events: rs?.docs || [], eventsLoading: false });
  },
  updateEvent: async (id: string, event: EventType) => {
    await Promise.resolve();
    set((state) => ({
      ...state,
      events: state.events.map((e) => (e.id === id ? event : e)),
    }));
  },
  appendEvent: async (event: EventType) => {
    await Promise.resolve();
    set((state) => ({
      ...state,
      events: [...state.events, event],
    }));
  },
  deleteEvent: async (id: string) => {
    await Promise.resolve();
    set((state) => ({
      ...state,
      events: state.events.filter((e) => e.id !== id),
    }));
  },
}));
