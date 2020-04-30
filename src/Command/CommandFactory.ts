import GameService from './GameService'
import {Message, PartialMessage} from "discord.js";
import Di from "../Di";
import DebugCommand from "./DebugCommand";
import GameCommand from "./GameCommand";
import KillCommand from "./KillCommand";
import PollCommand from "./PollCommand";
import ResetCommand from "./ResetCommand";
import TimeCommand from "./TimeCommand";
import HelpCommand from "./HelpCommand";
import JoinCommand from "./JoinCommand";
import LeaveCommand from "./LeaveCommand";
import ListCommand from "./ListCommand";
import RolesCommand from "./RolesCommand";
import ConfigCommand from "./Config/ConfigCommand";

export default class CommandFactory {

    static gameMasterCommandList(): any {
        return {
            debug: () => DebugCommand,
            start: () => GameCommand,
            kill: () => KillCommand,
            poll: () => PollCommand,
            reset: () => ResetCommand,
            time: () => TimeCommand,
        }
    }

    static freeCommandList(): any {
        return {
            help: () => HelpCommand,
            join: () => JoinCommand,
            leave: () => LeaveCommand,
            list: () => ListCommand,
            roles: () => RolesCommand,
            config: () => ConfigCommand,
        }
    }

    static handle(message: Message|PartialMessage, di: Di): void {
        let args = message.content.split(' ');

        if (args.shift() === 'wog') {
            CommandFactory.handleCommand(di, message, args)
                .catch(console.error)
        }
    }

    static handleCommand(di: Di, message: Message | PartialMessage, args: string[]): Promise<any> {
        if (message.guild === null) {
            return Promise.reject('guild is null');
        }

        let stringCommand = args.shift();

        if (stringCommand === undefined) {
            return message.reply('Utilisez la commande *wog help* pour obtenir de l\'aide');
        }

        if (!Object.keys(this.gameMasterCommandList()).indexOf(stringCommand)) {
            if (message.author.username !== 'golngaz' || message.author.discriminator !== '8508') {
                return message.reply('Vous n\'êtes pas autorisé à faire de commande !')
            }
        }

        let command = this.gameMasterCommandList()[stringCommand];

        command = command || this.freeCommandList()[stringCommand]

        if (!command) {
            return message.reply('Commande inconnue !')
        }

        GameService.initDb(di.db, message.guild.id)

        let response = command().execute(message, args, di)
        if (!response) {
            return Promise.reject('la commande ' + command + ' n\'a pas renvoyé de promise')
        }

        return response.catch(console.error)
    }
}
