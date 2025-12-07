import { reset } from "../db/queries/users";


export async function handlerReset(_: string): Promise<void> {
    await reset();
    console.log("database reset");
}