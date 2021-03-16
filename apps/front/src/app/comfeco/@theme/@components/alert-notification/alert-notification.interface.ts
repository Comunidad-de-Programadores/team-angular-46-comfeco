import { TypeAlertNotification } from "./alert-notification.enum";

export interface AlertNotification {
  id?:number;
  type?:TypeAlertNotification;
  message:string;
  time?:number;
}