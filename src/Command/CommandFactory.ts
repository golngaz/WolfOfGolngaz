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
import RecapCommand from "./RecapCommand";

export default class CommandFactory {

    private static commandList(): any {
        return {
            help: () => HelpCommand,
            join: () => JoinCommand,
            leave: () => LeaveCommand,
            list: () => ListCommand,
            roles: () => RolesCommand,
            config: () => ConfigCommand,

            // mj
            debug: () => DebugCommand,
            start: () => GameCommand,
            kill: () => KillCommand,
            poll: () => PollCommand,
            reset: () => ResetCommand,
            time: () => TimeCommand,
            recap: () => RecapCommand
        }
    }

    private static gameMasterCommandList: string[] = [
        'debug',
        'start',
        'kill',
        'poll',
        'reset',
        'time',
        'recap',
    ]

    private static inGameCommandList: string[] = ['kill', 'poll', 'time', 'recap']


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

        let guildDb = GameService.initDb(di.db, message.guild.id) as any;

        let gameDb = guildDb.value().game;

        if (gameDb.start) {
            if (this.isGameMasterRestricted(gameDb, message, stringCommand)) {
                return message.reply('Seul le MJ peut faire cette commande');
            }
        } else if (this.isInGameCommand(stringCommand)) {
            return message.reply('La partie doit être en cours pour utiliser cette commande');
        }

        let command = this.commandList()[stringCommand]

        if (!command) {
            return message.reply('Commande inconnue !')
        }

        let response = command().execute(message, args, di)

        if (!response) {
            return Promise.reject('la commande ' + command + ' n\'a pas renvoyé de promise')
        }

        return response.catch(console.error)
    }

    private static isInGameCommand(stringCommand: string): boolean {
        return this.inGameCommandList.indexOf(stringCommand) !== -1;
    }

    private static isGameMasterRestricted(gameDb: any, message: Message | PartialMessage, stringCommand: string): boolean {
        return gameDb.masterMemberId !== message.author.id && this.gameMasterCommandList.indexOf(stringCommand) !== -1;
    }
}
