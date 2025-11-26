import { reset } from "src/db/queries/users";


export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
    await reset();
    console.log(`database reset`);
}