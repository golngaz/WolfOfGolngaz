import Shaman from '../Game/Shaman'
import Di from '../Di';
import {Guild, GuildMember, Message, PartialMessage, TextChannel} from 'discord.js';
import Lowdb, {LoDashExplicitSyncWrapper, LowdbSync} from "lowdb";
import PlayerFactory from "../Game/PlayerFactory";

export default class GameService {
    private guild: Guild;
    private db: any;
    private guildDb: any;

    constructor(di: Di, guild: Guild) {
        this.guild = guild
        this.db = di.db
        this.guildDb = GameService.initDb(this.db, guild.id)
    }

    end() {
        let node = this.db.get('guilds').find({id: this.guild.id})

        node.value().game = {
            active: false,
            time: 'night',
            masterMemberId: '',
            players: [],
        }

        node.write()
    }

    initConfig() {
        let node = this.db.get('guilds').find({id: this.guild.id})

        node.value().game = {
            active: false,
            time: 'night',
            masterMemberId: '',
            players: [],
        }

        node.value().config = {
            roles: ['werewolf', 'werewolf', 'seer']
        }

        node.write()
    }

    kill(message: Message|PartialMessage, memberToKill: GuildMember, reason?: string): Promise<any> {
        if (!memberToKill) {
            return message.reply('Joueur introuvable');
        }

        const gameChannel = this.guild.channels.cache
            .filter(channel => channel.name === 'village' && channel.type === 'text')
            .first() as TextChannel
        ;

        const graveyard = this.guild.channels.cache
            .filter(channel => channel.name === 'cimetière' && channel.type === 'text')
            .first() as TextChannel
        ;

        const deathRole = this.guild.roles.cache.filter(role => role.name === 'mort').first();

        memberToKill.roles.add(deathRole)
            .then(() => graveyard.send(memberToKill.toString() + ', tu viens de rejoindre le cimetière.. Bienvenue à toi !'))
            .catch(error => {
                message.reply('le rôle n\'a pas pû être ajouté ! Le bot n\'a peu être pas les droits');

                console.error(error);
            })

        reason = reason ? '(Raison : **'+reason+'**)' : '';

        // @fixme ??
        // @ts-ignore
        let memberDb = this.db.get('guilds').find({id: message.guild.id}).get('game.players').find({memberId: memberToKill.id}).value();

        if (!memberDb) {
            return message.reply('Le joueur n\'a pas été trouvé dans la partie');
        }

        let player = PlayerFactory.get(memberDb.roleKey, memberToKill);

        return gameChannel.send('Le joueur ' + memberToKill.toString() + ', qui était "**' + player.label() + '**" est mort.. Rip ' + reason);
    }

    static initDb(db: any, guildId: string): LoDashExplicitSyncWrapper<any> {
        let node = db.get('guilds').find({id: guildId})

        if (node.value()) {
            return node
        }

        console.log('création de la guilde id : ' + guildId)

        let defaultGuildDb = {
            id: guildId,
            game: {
                active: false,
                time: 'night',
                masterMemberId: '',
                players: [],
            },
            config: {
                roles: ['werewolf', 'werewolf', 'seer']
            }
        }

        db.get('guilds').push(defaultGuildDb).write()

        return db.get('guilds').find({id: guildId})
    }

    /**
     * Est-ce qu'une partie est en cours
     */
    isRunning() {
        return this.guildDb.get('game').value() && this.guildDb.get('game').value().active === true
    }

    isDay() {
        return this.guildDb.get('game').value().time === 'day'
    }

    isNight() {
        return this.guildDb.get('game').value().time === 'night'
    }

    handleMessage(message) {
        if (message.channel.name !== 'cimetière' || this.isDay()) {
            return
        }

        // @todo parcourir les joueurs et exécuter le code contenu dans les classe du rôle
        let shaman = this.guildDb.get('game').value().players.filter(player => player.roleKey === Shaman.key())[0]
        if (shaman) {
            let memberShaman = message.guild.members.cache
                .filter(member => member.id === shaman.memberId)
                .filter(member => member.roles.cache.some(role => role.name === 'jeu'))
                .filter(member => !member.roles.cache.some(role => role.name === 'mort'))
                .first()

            if (memberShaman) {
                return memberShaman
                    .send('Mort : "*' + message.content + '*"')
            }
        }
    }
}
