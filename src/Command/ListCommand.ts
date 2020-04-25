import AbstractCommand from "./AbstractCommand";
import GameCommand from "./GameCommand";

class ListCommand extends AbstractCommand {
    /**
     * @param message
     * @param {string[]} args
     * @param {Di} di
     */
    static execute(message, args, di) {
        // @todo utiliser la db maintenant directement
        var game = new GameCommand(message, di.db);

        message.reply(game.roleMap.map(roleClass => (new roleClass()).label()).join(', '));

        return Promise.resolve();
    }

    static help() {
        return 'Affiche la liste des rôles de la prochaine partie';
    }
}

export = ListCommand;