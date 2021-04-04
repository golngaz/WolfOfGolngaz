import AbstractCommand from "./AbstractCommand";
import GameCommand from "./GameCommand";
import GameService from "./GameService";

class ListCommand extends AbstractCommand {
    /**
     * @param message
     * @param {string[]} args
     * @param {Di} di
     */
    static execute(message, args, di) {
        message.reply(di.get(GameService).roleMap().join(', '));

        return Promise.resolve();
    }

    static help() {
        return 'Affiche la liste des rôles de la prochaine partie';
    }
}

export = ListCommand;
