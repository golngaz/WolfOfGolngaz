import {Message, PartialMessage} from "discord.js";
import Di from "../Di";
import AbstractCommand from "./AbstractCommand";
import GameService from "./GameService";
import Player from "../Game/Player";

class RecapCommand extends AbstractCommand {

    static execute(message: Message|PartialMessage, args: string[], di: Di) {
        var response: string = '';

        var gameService = di.get(GameService);

        if (!gameService.isRunning()) {
            return message.reply('Aucune partie en cours');
        }

        response += gameService.isDay() ? 'Bonjour :city_sunset:,\n\n' : 'Bonsoir :night_with_stars:,\n\n';

        response += gameService.players()
            .map((player: Player) => player.toString())
            .join('\n')
        ;

        return message.channel.send(response);
    }

    static help() {
        return 'Permet d\'obtenir un résumé de la partie';
    }
}

export = RecapCommand;
