export interface UserModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string,
    account: AccountModel;
}
