import {Message, PartialMessage, TextChannel} from "discord.js";
import Di from "../Di";
import AbstractCommand from "./AbstractCommand";

class DebugCommand extends AbstractCommand {
    static execute(message: Message|PartialMessage, args: string[], di: Di) {
        // @todo utility for sending
        return (
            message.guild.channels.cache
                .filter(channel => channel.name === 'commands' && channel.type === 'text')
                .first() as TextChannel
        ).send('_stop')
    }
}

export = DebugCommand;