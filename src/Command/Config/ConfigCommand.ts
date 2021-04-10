import {Message} from "discord.js";
import Di from "../../Di";
import ConfigRoleService from "./ConfigRoleService";
import AbstractCommand from "../AbstractCommand";

export default class ConfigCommand extends AbstractCommand {
    static execute(message: Message, args: string[], di: Di) {
        if (!args[0]) {
            return message.reply('Vous devez préciser le noeud de la config')
        }

        if (args[0] === 'roles' || args[0] === 'role') {
            args.shift()
            return di.get(ConfigRoleService).handle(message, args)
        }

        // @todo raccourcis à supprimer ou non (selon si la config gère autre chose)
        return di.get(ConfigRoleService).handle(message, args)
    }

    static signature() {
        return '[[role(s)] add|remove role_clé (exemple: fox)]'
    }

    static help() {
        return 'Permet de gérer la configuration d\'une partie'
    }

    public static isInGame(): boolean | null {
        return false;
    }
}
