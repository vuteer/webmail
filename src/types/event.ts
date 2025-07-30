export type EventType = {
  id: string;
  calendar: {
    color: string;
    id: string;
    displayName: string;
  };
  url: string;
  data: string;
  description: string;
  endDate: number;
  location: string;
  startDate: number;
  status: string;
  summary: string;
};
