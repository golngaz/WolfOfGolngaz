import {Message, PartialMessage} from "discord.js";
import Di from "../Di";
import AbstractCommand from "./AbstractCommand";

class LeaveCommand extends AbstractCommand {
    static execute(message: Message|PartialMessage, args: string[], di: Di) {
        const gameRole = message.guild.roles.cache.filter(role => role.name === 'jeu').first();

        message.guild.member(message.author).roles.remove(gameRole)
            .catch(console.error)
        ;

        return message.reply(message.author.toString() + ' tu as quitté la prochaine partie');
    }

    static help() {
        return 'Permet de ne pas rejoindre la prochaine partie';
    }
}

export = LeaveCommand;