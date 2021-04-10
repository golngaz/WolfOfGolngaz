import AbstractCommand from "./AbstractCommand";
import GameService from "./GameService";
import Player from "../Game/Player";

class ListCommand extends AbstractCommand {
    /**
     * @param message
     * @param {string[]} args
     * @param {Di} di
     */
    static execute(message, args, di) {
        message.reply(di.get(GameService).roleMap().map((role: typeof Player) => role.key()).join(', '));

        return Promise.resolve();
    }

    static help() {
        return 'Affiche la liste des rôles de la prochaine partie';
    }
}

export = ListCommand;
