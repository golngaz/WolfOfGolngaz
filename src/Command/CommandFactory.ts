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
import AbstractCommand from "./AbstractCommand";

interface Mapping {
    [key: string]: typeof AbstractCommand
}

export default class CommandFactory {

    public static list(): Mapping {
        return {
            help: HelpCommand,
            join: JoinCommand,
            leave: LeaveCommand,
            list: ListCommand,
            roles: RolesCommand,
            config: ConfigCommand,

            // mj
            debug: DebugCommand,
            start: GameCommand,
            kill: KillCommand,
            poll: PollCommand,
            reset: ResetCommand,
            time: TimeCommand,
            recap: RecapCommand
        }
    }

    static handle(message: Message|PartialMessage, di: Di): void {
        let args = message.content.split(' ');

        if (args.shift().toLowerCase() === 'wog') {
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

        let command: typeof AbstractCommand = this.list()[stringCommand];

        if (!command) {
            return message.reply('Commande inconnue !')
        }

        let guildDb = GameService.initDb(di.db, message.guild.id) as any;

        let gameDb = guildDb.value().game;

        if (command.isInGame() !== null) {
            if (gameDb.active && !command.isInGame()) {
                return message.reply('Aucune partie ne doit être en cours pour lancer cette commande (wog reset si pas de parties en cours)');
            } else if (!gameDb.active && command.isInGame()) {
                return message.reply('La partie doit être en cours pour utiliser cette commande');
            }
        }

        if (this.isGameMasterRestricted(gameDb, message, command)) {
            return message.reply('Seul le MJ peut faire cette commande');
        }

        let response = command.execute(message, args, di)

        if (!response) {
            return Promise.reject('la commande ' + command + ' n\'a pas renvoyé de promise')
        }

        return response.catch(console.error)
    }

    private static isGameMasterRestricted(gameDb: any, message: Message | PartialMessage, command: typeof AbstractCommand): boolean {
        if (!gameDb.masterMemberId) {
            return false;
        }

        return gameDb.masterMemberId !== message.author.id && command.isGameMasterOnly();
    }
}
