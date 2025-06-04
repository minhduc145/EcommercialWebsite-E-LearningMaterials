import { AccountModel } from "./AccountModel";

export interface UserModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string,
    phone:string,
    account: AccountModel,
    birthDate:Date,
    isMale:boolean|true
}
