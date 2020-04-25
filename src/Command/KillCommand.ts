import {Message, PartialMessage, TextChannel} from "discord.js";
import Di from "../Di";
import AbstractCommand from "./AbstractCommand";
import PlayerFactory from "../Game/PlayerFactory.js";

class KillCommand extends AbstractCommand {

    static execute(message: Message|PartialMessage, args: string[], di: Di) {
        if (!args[0]) {
            return message.reply('Vous devez préciser un nom de joueur');
        }

        const guild = message.guild;

        const memberToKill = message.guild.member(message.mentions.users.first());

        if (!memberToKill) {
            return message.reply('Joueur ' + args[0] + ' introuvable');
        }

        const gameChannel = guild.channels.cache
            .filter(channel => channel.name === 'village' && channel.type === 'text')
            .first() as TextChannel
        ;

        const graveyard = guild.channels.cache
            .filter(channel => channel.name === 'cimetière' && channel.type === 'text')
            .first() as TextChannel
        ;

        const deathRole = guild.roles.cache.filter(role => role.name === 'mort').first();

        memberToKill.roles.add(deathRole)
            .then(() => graveyard.send(memberToKill + ', tu viens de rejoindre le cimetière.. Bienvenue à toi !'))
            .catch(error => {
                message.reply('le rôle n\'a pas pû être ajouté ! Le bot n\'a peu être pas les droits');

                console.error(error);
            })

        let reason = '';

        if (args[1]) {
            reason = '(Raison : **'+args[1]+'**)';
        }

        // @fixme ??
        // @ts-ignore
        let memberDb = di.db.get('guilds').find({id: message.guild.id}).get('game.players').find({memberId: memberToKill.id}).value();

        if (!memberDb) {
            message.reply('Le joueur n\'a pas été trouvé dans la partie');
        }

        let player = PlayerFactory.get(memberDb.roleKey, memberToKill);

        return gameChannel.send('Le joueur ' + memberToKill + ', qui était "**' + player.label() + '**" est mort.. Rip ' + reason);
    }

    static signature() {
        return '@joueur [raison]'
    }

    static help() {
        return 'Tue une personne dans le jeu'
    }
}

export = KillCommand;