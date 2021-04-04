import {Message, PartialMessage} from "discord.js";
import Di from "../Di";
import AbstractCommand from "./AbstractCommand";

class JoinCommand extends AbstractCommand {
    static execute(message: Message|PartialMessage, args: string[], di: Di) {
        message.author.fetch(true).catch(console.error)

        const gameRole = message.guild.roles.cache.filter(role => role.name === 'jeu').first();

        message.guild.member(message.author).roles.add(gameRole)
            .catch(console.error)
        ;

        let configNode = di.db.get('guilds').find({id: di.getGuild().id}).get('config')

        if (configNode.value().joins.some(id => id === message.author.id)) {
            return message.author.send('Tu as **déjà** rejoint la prochaine partie')
        }

        configNode.value().joins.push(message.author.id)

        configNode.write()

        return message.author.send('Tu as rejoint la prochaine partie');
    }

    static help() {
        return 'Permet de rejoindre la prochaine partie';
    }
}

export = JoinCommand;
