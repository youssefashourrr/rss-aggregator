import { createUser, getAllUsers, getUserByName } from "src/db/queries/users";
import { readConfig, setUser } from "src/config";


export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    
    const name: string = args[0];
    const existingUsers = await getUserByName(name);
    if (existingUsers.length > 0) {
        throw new Error(`user already exists`);
    }

    await createUser(name);
    setUser(name);
    console.log(`user created: ${name}`);
}

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const name: string = args[0];
    const existingUsers = await getUserByName(name);
    if (existingUsers.length === 0) {
        throw new Error(`user not found`);
    }

    setUser(name);
    console.log(`logged in as ${name}`);
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