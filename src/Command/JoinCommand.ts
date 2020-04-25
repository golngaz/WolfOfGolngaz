import {Message, PartialMessage} from "discord.js";
import Di from "../Di";
import AbstractCommand from "./AbstractCommand";

class JoinCommand extends AbstractCommand {
    static execute(message: Message|PartialMessage, args: string[], di: Di) {
        const gameRole = message.guild.roles.cache.filter(role => role.name === 'jeu').first();

        message.guild.member(message.author).roles.add(gameRole)
            .catch(console.error)
        ;

        return message.reply(message.author + ' tu as rejoint la prochaine partie');
    }

    static help() {
        return 'Permet de rejoindre la prochaine partie';
    }
}

export = JoinCommand;