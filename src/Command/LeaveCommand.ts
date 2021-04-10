import {Message, PartialMessage} from "discord.js";
import Di from "../Di";
import AbstractCommand from "./AbstractCommand";
import ResetService from "./ResetService";

class LeaveCommand extends AbstractCommand {
    static async execute(message: Message | PartialMessage, args: string[], di: Di) {
        await di.get(ResetService).resetMember(message.member)

        return message.author.send('Tu as quitté la prochaine partie');
    }

    static help() {
        return 'Permet de ne pas rejoindre la prochaine partie';
    }

    public static isInGame(): boolean | null {
        return false;
    }
}

export = LeaveCommand;
