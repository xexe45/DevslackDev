import { MessageDayInterface } from "./messageday.interface";
export interface MessageInterface {
  date: string;
  messages?: MessageDayInterface[];
}
