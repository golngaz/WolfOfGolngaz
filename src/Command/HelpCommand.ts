import {Message, PartialMessage} from "discord.js";
import Di from "../Di";
import AbstractCommand from "./AbstractCommand";
import CommandFactory from "./CommandFactory.js";

class HelpCommand extends AbstractCommand {
    static execute(message: Message|PartialMessage, args: string[], di: Di) {
        if (!args[0]) {
            return this._list(message)
        }

        let mj = false
        let key = args.shift()

        if (key === 'mj') {
            key = args.shift()
            mj = true
        }

        if (mj && !key) {
            return this._mjList(message)
        }

        let command = mj ? CommandFactory.gameMasterCommandList()[key] : CommandFactory.freeCommandList()[key]

        if (!command) {
            return message.reply('Commande inconnue (ou pas de droits)')
        }

        command = command()

        return message.channel.send(key + this._signature(command.signature()) + ' : *' + command.help() + '*')
    }

    static _signature(signature) {
        return signature ? ' **' + signature + '**' : ''
    }

    static _list(message) {
        return message.channel.send('Liste des commandes : ' + Object.keys(CommandFactory.freeCommandList()).join(', '))
    }

    static _mjList(message) {
        return message.channel.send('Liste des commandes : ' + Object.keys(CommandFactory.gameMasterCommandList()).join(', '))
    }

    static signature() {
        return '[mj] [command]'
    }

    static help() {
        return 'Permet d\'avoir des informations sur une commande ou d\'afficher la liste de toutes les commandes\n' +
            'mj -> affiche les commandes du MJ\n' +
            'command -> affiche un help détaillé pour la commande'
    }
}

export = HelpCommand;