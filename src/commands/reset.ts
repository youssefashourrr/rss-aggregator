import { reset } from "../db/queries/users";


export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
    await reset();
    console.log(`Database reset`);
}