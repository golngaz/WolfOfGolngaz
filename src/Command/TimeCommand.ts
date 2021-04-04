import AbstractCommand from "./AbstractCommand";
import {GuildMember, Message, PartialMessage, TextChannel} from "discord.js";
import Di from "../Di";
import config from '../../config.json';
import GameService from "./GameService";

class TimeCommand extends AbstractCommand {
    static execute(message: Message|PartialMessage, args: string[], di: Di) {
        if (!args[0] || args[0] !== 'day' && args[0] !== 'night') {
            return message.reply('vous devez préciser day/night');
        }

        const time = args.shift();

        const guildDb = di.db.get('guilds').find({id: message.guild.id});

        // @ts-ignore
        if (guildDb.value().game.active !== true) {
            return message.reply('Aucune partie en cours');
        }

        // @ts-ignore
        if (guildDb.value().game.time === time) {
            return message.reply('il fait déjà ' + this._translate(time) + ' dans le village !');
        }

        // @ts-ignore
        guildDb.value().game.time = time;

        guildDb.write();

        let playerRole = message.guild.roles.cache.filter(role => role.name === 'jeu').first();

        if (time === 'night') {
            this._handleNight(message.guild);
        }

        let deadMember = args.shift();
        if (deadMember) {
            let memberToKill = message.guild.member(message.mentions.users.first());
            di.get(GameService).kill(message, memberToKill, time === 'night' ? 'Pendu par le village' : 'Mort pendant la nuit');
        }

        // @todo mieux gérer le player role mainteant que la mise à jour est faite
        return (
            message.guild.channels.cache
                .filter(channel => channel.name === 'village' && channel.type === 'text')
                .first() as TextChannel
        ).send(playerRole.toString() + ' ' + this.messageAnnounce(time));
    }

    static _handleNight(guild) {
        // @todo finir (musique)
        let channel = guild.channels.cache.filter(channel => channel.name === 'commands' && channel.type === 'text').first();

        return channel
            .send('`_play ' + config.music.night.link + '`');
    }

    static _translate(key) {
        return {
            day: 'jour',
            night: 'nuit'
        }[key];
    }

    static messageAnnounce(key) {
        return {
            day: 'Le jour vient de se lever au village',
            night: 'La nuit vient de tomber sur le village !'
        }[key];
    }

    static signature() {
        return '{day|night} [memberToKill]';
    }

    static help() {
        return 'Gère la journée pendant la partie';
    }
}

export = TimeCommand;
