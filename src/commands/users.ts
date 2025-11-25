import { createUser, getAllUsers, getUserByName } from "../db/queries/users";
import { readConfig, setUser } from "../config";


export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error(`Usage: ${cmdName} <name>`);
    }
    
    const name: string = args[0];
    const existingUsers = await getUserByName(name);
    if (existingUsers.length > 0) {
        throw new Error(`User already exists: ${name}`);
    }

    await createUser(name);
    setUser(name);
    console.log(`User created: ${name}`);
}

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error(`Usage: ${cmdName} <name>`);
    }

    const name: string = args[0];
    const existingUsers = await getUserByName(name);
    if (existingUsers.length === 0) {
        throw new Error(`User not found: ${name}`);
    }

    setUser(name);
    console.log(`Logged in as: ${name}`);
}

export async function handlerListUsers(cmdName: string, ...args: string[]): Promise<void> {
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