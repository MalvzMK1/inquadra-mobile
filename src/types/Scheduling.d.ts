type Scheduling = {
  id: string;
  schedulingTitle: string;
  court_availability: string;
  date: string;
  users: Array<string>;
  valuePayed: number;
  payedStatus: "waiting" | "payed" | "canceled";
  owner: string;
  payDay: Date;
  activation_key: string;
};
