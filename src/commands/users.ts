import { readConfig, setUser } from "../config";
import { createUser, getAllUsers, getUserByName } from "../db/queries/users";

import type { User } from "../db/schema";


export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    
    const name: string = args[0];
    const existingUser: User | null = await getUserByName(name);
    if (existingUser) {
        throw new Error(`user exists: ${name}`);
    }

    await createUser(name);
    setUser(name);
    console.log(`registered: ${name}`);
}

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const name: string = args[0];
    const existingUser: User | null = await getUserByName(name);
    if (!existingUser) {
        throw new Error(`user not found: ${name}`);
    }

    setUser(name);
    console.log(`logged in: ${name}`);
}

export async function handlerListUsers(cmdName: string, ...args: string[]): Promise<void> {
    const users: User[] = await getAllUsers();
    const current: string = readConfig().currentUserName;
    
    for (const user of users) {
        if (user.name === current) {
            console.log(`* ${user.name} (current)`);
        } else {
            console.log(`* ${user.name}`);
        }
    }
}