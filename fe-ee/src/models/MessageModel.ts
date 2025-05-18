import { UserModel } from "./UserModel";

export interface MessageModel {
  id: number;
  title: string;
  message: string;
  isForEveryone: boolean;
  createdAt: string;

  sender: UserModel | null;
  receiver: UserModel | null;
}