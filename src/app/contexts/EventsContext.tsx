import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Event {
  id: string;
  title: string;
  time: string;
  color: string;
  date: string;
  duration?: string;
  type?: string;
  participants?: string;
  location?: string;
  notes?: string;
  company?: string;
  companyId?: string;
  contact?: string;
  dealValue?: string;
  sentiment?: string;
  focusAreas?: string[];
}

interface EventsContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

// Initial events data
const initialEvents: Event[] = [
  // Today (March 17, 2026)
  { id: "demo-1", title: "Product Demo - Acme Corp", time: "10:00am", color: "purple", date: "2026-03-17" },
  { id: "discovery-1", title: "Discovery Call - TechStart", time: "2:00pm", color: "orange", date: "2026-03-17" },
  { id: "follow-1", title: "Follow-up - DataFlow", time: "4:00pm", color: "blue", date: "2026-03-17" },
  
  // Tomorrow (March 18)
  { id: "standup-1", title: "Team Stand-up", time: "9:00am", color: "gray", date: "2026-03-18" },
  { id: "demo-2", title: "Product Demo - CloudVista", time: "11:00am", color: "purple", date: "2026-03-18" },
  { id: "nego-1", title: "Negotiation Call - GlobalTech", time: "3:00pm", color: "red", date: "2026-03-18" },
  
  // Rest of week
  { id: "discovery-2", title: "Discovery - RetailMax", time: "10:00am", color: "orange", date: "2026-03-19" },
  { id: "demo-3", title: "Demo - FinanceHub", time: "1:00pm", color: "purple", date: "2026-03-19" },
  { id: "closing-1", title: "Closing Call - MediCare", time: "4:00pm", color: "green", date: "2026-03-20" },
  { id: "demo-4", title: "Product Demo - LogiTech", time: "9:30am", color: "purple", date: "2026-03-21" },
];

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const addEvent = (event: Event) => {
    setEvents((prev) => [...prev, event]);
  };

  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const updateEvent = (id: string, updatedEvent: Partial<Event>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event))
    );
  };

  return (
    <EventsContext.Provider value={{ events, addEvent, removeEvent, updateEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}