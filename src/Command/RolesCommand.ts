import {Message} from "discord.js";
import Di from "../Di";
import AbstractCommand from "./AbstractCommand";
import PlayerFactory from "../Game/PlayerFactory";

export default class RolesCommand extends AbstractCommand {
    static execute(message: Message, args: string[], di: Di): Promise<any> {
        let response = '```\n';
        let mapping = PlayerFactory.mapping();

        let largestKeyLength = Math.max(...Object.keys(mapping).map(key => key.length)) + 2;

        Object.keys(mapping).forEach((key: string) => {
            let tabulate = ' '.repeat(largestKeyLength - (key.length + 2));

            response += '[' + key + '] ' + tabulate + (new mapping[key]).label() + '\n';
        })

        response += '\n```';

        return message.channel.send(response);
    }

    static help(): string {
        return 'Affiche la liste des rôles gérés par le bot';
    }
}
