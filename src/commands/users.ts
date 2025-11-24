import { readConfig } from "../config";
import { getAllUsers } from "../db/queries/users";


export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void> {
    const users = await getAllUsers();
    const current = readConfig().currentUserName;
    
    for (const user of users) {
        if (user.name === current) {
            console.log(`* ${user.name} (current)`);
        } else {
            console.log(`* ${user.name}`);
        }
    }
}