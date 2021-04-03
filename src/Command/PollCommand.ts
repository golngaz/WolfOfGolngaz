import AbstractCommand from "./AbstractCommand";
import {Message, PartialMessage, TextChannel} from "discord.js";

class PollCommand extends AbstractCommand {
    /**
     * @param message
     * @param {string[]} args
     */
    static execute(message: Message|PartialMessage, args: string[]) {
        const guild = message.guild;

        const gameChannel = guild.channels.cache
            .filter(channel => channel.name === 'village' && channel.type === 'text')
            .first() as TextChannel
        ;

        let maxPoll = 19;

        // @todo voir si ya un encapsule méthode
        // @todo essayer d'ajouter une fonction chunck dans le prototype de Array
        const membersPolls = guild.members.cache
            .filter(member => member.roles.cache.some(role => role.name === 'jeu'))
            .filter(member => !member.roles.cache.some(role => role.name === 'mort'))
            .map(member => member.toString())
            .map((member, index: number) => membersPolls.slice(index * maxPoll, (index * maxPoll) + maxPoll))
            .filter(chunk => chunk.length > 0)
            .forEach(chunk => gameChannel.send('/poll "Voter pour éliminer.." "' + chunk.join('" "') + '"'))
        ;

        return Promise.resolve();
    }

    static help() {
        return 'Génère un vote de villageois sur tous les villageois vivant';
    }
}

export = PollCommand;
