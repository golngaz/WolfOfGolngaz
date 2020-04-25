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

        // @todo voir si ya un encapsule méthode
        const membersPolls = guild.members.cache
            .filter(member => member.roles.cache.some(role => role.name === 'jeu'))
            .filter(member => !member.roles.cache.some(role => role.name === 'mort'))
            .map(member => {
                return member.toString()
            })
            .join('" "')
        ;

        return gameChannel.send('/poll "Voter pour éliminer.." "' + membersPolls + '"');
    }

    static help() {
        return 'Génère un vote de villageois sur tous les villageois vivant';
    }
}

export = PollCommand;