import {Message, PartialMessage} from "discord.js";
import Di from "../Di";
import AbstractCommand from "./AbstractCommand";
import GameService from "./GameService";

class KillCommand extends AbstractCommand {

    static execute(message: Message|PartialMessage, args: string[], di: Di) {
        if (!args.shift()) {
            return message.reply('Vous devez préciser un nom de joueur');
        }

        const memberToKill = message.guild.member(message.mentions.users.first());

        let reason = args.shift();

        di.get(GameService).kill(message, memberToKill, reason);
    }

    static signature() {
        return '@joueur [raison]'
    }

    static help() {
        return 'Tue une personne dans le jeu'
    }
}

export = KillCommand;