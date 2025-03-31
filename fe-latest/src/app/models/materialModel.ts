export class materialModel {
    username: string;
    email: string;

    constructor(username: string, email: string) {
        this.username = username;
        this.email = email;
    }

    getInfo(): string {
        return `User: ${this.username}, Email: ${this.email}`;
    }
}