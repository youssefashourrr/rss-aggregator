import { createUser, getUserByName } from "../db/queries/users";
import { setUser } from "../config"
 
export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    
    const name: string = args[0];
    const existingUsers = await getUserByName(name);
    if (existingUsers.length > 0) {
        throw new Error(`User with name "${name}" already exists.`);
    }

    await createUser(name);
    setUser(name);
    console.log(`User "${name}" registered and set as current user.`);
}