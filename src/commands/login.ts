import { setUser } from "../config";
import { getUserByName } from "../db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const name: string = args[0];
    const existingUsers = await getUserByName(name);
    if (existingUsers.length === 0) {
        throw new Error(`User with name "${name}" does not exist.`);
    }

    setUser(name);
    console.log(`User set successfully`);
}