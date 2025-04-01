import { Command } from "commander";
import Context from "../context";

export abstract class BaseCommand {
    abstract name: string;
    abstract description: string;
    protected context!: Context;

    constructor() {}

    abstract action(...args: any[]): Promise<void>;

    createCommand(context: Context): Command {
        this.context = context;
        const cmd = new Command(this.name);
        cmd.description(this.description);
        this.setup(cmd);
        return cmd;
    }

    protected setup(cmd: Command): void {
        cmd.action((...args: any[]) => this.action(...args));
    }
}
