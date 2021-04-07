import AbstractCommand from "./AbstractCommand";
import {Message, PartialMessage} from "discord.js";
import ResetService from './ResetService.js';
import GameService from './GameService.js';
import Di from "../Di";

class ResetCommand extends AbstractCommand {
    static async execute(message: Message | PartialMessage, args: string[], di: Di) {
        await di.get(GameService).fetch()

        let gameRole = message.guild.roles.cache.filter(role => role.name === 'jeu').first()

        const members = gameRole.members

        let gameService: GameService = di.get(GameService);

        await gameService.end().then(() => console.log('game ended'));

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

    public static isGameMasterOnly(): boolean {
        return true;
    }
}

export = ResetCommand;
