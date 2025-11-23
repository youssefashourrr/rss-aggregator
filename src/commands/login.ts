import { setUser } from "../config";


export function handlerLogin(cmdName: string, ...args: string[]): void {
    if (args.length < 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    setUser(args[0]);
    console.log(`User set successfully`);
}