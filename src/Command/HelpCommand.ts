import {Message, PartialMessage} from "discord.js";
import Di from "../Di";
import AbstractCommand from "./AbstractCommand";
import CommandFactory from "./CommandFactory.js";

class HelpCommand extends AbstractCommand {
    static execute(message: Message|PartialMessage, args: string[], di: Di) {
        if (!args[0]) {
            return this._list(message)
        }

        let key = args.shift()

        let command = CommandFactory.list()[key];

        if (!command) {
            return message.reply('Commande inconnue (ou pas de droits)')
        }

        return message.channel.send(key + this._signature(command.signature()) + ' : *' + command.help() + '*')
    }

    static _signature(signature) {
        return signature ? ' **' + signature + '**' : ''
    }

    static _list(message) {
        let list: string = Object.keys(CommandFactory.list())
            .map(key => key + ' ' + CommandFactory.list()[key].signature())
            .join('\n')

        return message.channel.send('Liste des commandes : \n' + list)
    }

    static signature() {
        return '[command]'
    }

    static help() {
        return 'Permet d\'avoir des informations sur une commande ou d\'afficher la liste de toutes les commandes\n' +
            'command -> affiche un help détaillé pour la commande'
    }
}

export = HelpCommand;
