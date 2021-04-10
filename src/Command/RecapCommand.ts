import {Message, PartialMessage} from "discord.js";
import Di from "../Di";
import AbstractCommand from "./AbstractCommand";
import GameService from "./GameService";
import Player from "../Game/Player";
import Util from "../Util";

class RecapCommand extends AbstractCommand {

    static async execute(message: Message | PartialMessage, args: string[], di: Di) {
        var response: string = '';

        var gameService = di.get(GameService);

        await gameService.fetch();

        if (!gameService.isRunning()) {
            return message.reply('Aucune partie en cours');
        }

        response += gameService.isDay() ? 'Bonjour :city_sunset:,\n\n' : 'Bonsoir :night_with_stars:,\n\n';

        response += Util.shuffle(gameService.players())
            .map((player: Player) => player.toString())
            .join('\n')
        ;

        return message.channel.send(response);
    }

    static help() {
        return 'Permet d\'obtenir un résumé de la partie';
    }

    public static isInGame(): boolean {
        return true;
    }

    public static isGameMasterOnly(): boolean {
        return false
    }
}

export = RecapCommand;
