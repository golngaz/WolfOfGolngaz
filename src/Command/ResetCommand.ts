import AbstractCommand from "./AbstractCommand";
import {Message, PartialMessage} from "discord.js";
import ResetService from './ResetService.js';
import GameService from './GameService.js';
import Di from "../Di";

class ResetCommand extends AbstractCommand {
    static execute(message: Message|PartialMessage, args: string[], di: Di) {
        const members = message.guild.members.cache.filter(member => member.roles.cache.some(role => role.name === 'jeu'));

        // @ts-ignore : delete when GameService will be migrated
        di.get(GameService).end();

        if (!args[0]) {
            // @ts-ignore : delete when GameService will be migrated
            di.get(ResetService).resetMembers(members, false);

            return message.reply('Tous les joueurs sont réinitialisés');
        }

        if (args[0] === 'soft') {
            // @ts-ignore : delete when GameService will be migrated
            di.get(ResetService).resetMembers(members, true);

            return message.reply('Les joueurs sont réinitialisés mais restent pour la prochaine partie');
        }

        if (args[0] === 'config') {
            // @ts-ignore : delete when GameService will be migrated
            di.get(GameService).initConfig();

            return message.reply('La configuration à été réinitialisé');
        }

        return message.reply('Nani nani ??');
    }

    static signature() {
        return '[soft|config]';
    }

    static help() {
        return 'Permet de réinitialiser une partie\n' +
            'soft -> n\'enlève pas les joueurs de la prochaine partie\n' +
            'config -> réinitialise la configuration de la partie'
    }
}

export = ResetCommand;