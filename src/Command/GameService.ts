import Shaman from '../Game/Shaman'
import Di from '../Di';
import {Guild, GuildChannel, GuildMember, Message, PartialMessage, Role, TextChannel} from 'discord.js';
import Lowdb, {LoDashExplicitSyncWrapper, LowdbSync} from "lowdb";
import PlayerFactory from "../Game/PlayerFactory";
import Player from "../Game/Player";

export default class GameService {
    private guild: Guild;
    private db: any;
    private guildDb: any;

    constructor(di: Di, guild: Guild) {
        this.guild = guild
        this.db = di.db
        this.guildDb = GameService.initDb(this.db, this.guild.id)
    }

    end(): Promise<GuildChannel[]> {
        // @todo calculer la fin de la partie à chaque mort sur la commande kill ou night ?

        this.guildDb.value().game = {
            active: false,
            time: 'night',
            masterMemberId: '',
            players: [],
        }

        this.guildDb.write()

        return this.resetWolfChannel()
    }

    wolfChannel(): TextChannel {
        return this.guild.channels.cache
            .filter(channel => channel.name === 'loup-garous' && channel.type === 'text')
            .first() as TextChannel
    }

    initConfig() {
        let node = this.guildDb

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
                // @todo renommer en masterUserId
                masterMemberId: '',
                players: [],
            },
            config: {
                joins: [],
                roles: ['werewolf', 'werewolf', 'seer']
            }
        }

        db.get('guilds').push(defaultGuildDb).write()

        return db.get('guilds').find({id: guildId})
    }

    /**
     * Est-ce qu'une partie est en cours
     */
    isRunning(): boolean {
        return this.guildDb.get('game').value() && this.guildDb.get('game').value().active === true
    }

    isDay(): boolean {
        return this.guildDb.get('game').value().time === 'day'
    }

    isNight(): boolean {
        return this.guildDb.get('game').value().time === 'night'
    }

    playersDb(role: typeof Player|null = null): Array<any> {

        var players = this.guildDb.get('game').value().players;

        if (role !== null) {
            return players.filter(player => player.roleKey === role.key());
        }

        return players;
    }

    /**
     * return member of the role. If many members of this role, will return the index member
     */
    memberFromRole(role: typeof Player, index: number = 0): GuildMember | null {
        let players = this.playersDb(role);

        if (players.length === 0) {
            return null;
        }

        let player = players[index];

        return this.guild.members.cache
            .filter(member => member.id === player.memberId)
            .first()
        ;
    }

    /**
     * @todo faire un listener
     */
    handleMessage(message) {
        if (message.channel.name !== 'cimetière' || this.isDay()) {
            return
        }

        // @todo parcourir les joueurs et exécuter le code contenu dans les classe du rôle
        return this.memberFromRole(Shaman)?.send('Mort : "*' + message.content + '*"')
    }

    /**
     * Retourne la liste des roles présents dans la config
     */
    roleMap(): Array<typeof Player> {
        return this.guildDb.get('config.roles').value().map((key: string) => PlayerFactory.mapping()[key])
    }

    players(): Array<Player> {
        return this.playersDb()
            .map((player: any) => {
                let member: GuildMember = this.guild.members.cache.filter(member => member.id === player.memberId).first();

                return {player: player, member: member};

            })
            .map((value: { member: GuildMember; player: any }) => {
                let playerRole: typeof Player = PlayerFactory.mapping()[value.player.roleKey];

                return new playerRole(value.member)
            })
        ;
    }

    role(roleKey: 'mort'|'jeu'|'maire'): Role {
        return this.guild.roles.cache.filter(role => role.name === roleKey).first()
    }

    async resetWolfChannel(): Promise<GuildChannel[]> {
        let promises = [];
        let channel = this.wolfChannel();

        channel.permissionOverwrites
            .filter(permission => permission.type === 'member')
            .forEach(permission => promises.push(permission.delete()))

        return await Promise.all<GuildChannel>(promises)
    }



    /**
     * Return list id of joins players user id
     */
    joins(): Array<string> {
        let joins = this.guildDb.get('config.joins').value();

        if (!joins || joins.length === 0) {
            return [];
        }

        return joins;
    }

    resetJoins() {
        let nodeConfig = this.guildDb.get('config');

        nodeConfig.value().joins = [];

        nodeConfig.write();
    }

    leave(member: GuildMember): Promise<void|GuildMember> {
        let gameRole = member.guild.roles.cache.filter(role => role.name === 'jeu').first()

        let nodeConfig = this.guildDb.get('config');
        nodeConfig.value().joins = nodeConfig.value().joins.filter(id => id !== member.user.id)
        nodeConfig.write()

        return member.roles.remove(gameRole)
            .catch(console.error)
    }

    /**
     * Put players joins the game in cache
     */
    async fetch() {
        await this.guild.roles.fetch()

        await this.guild.members.fetch({user: this.joins()})
            .then(members => console.log('fetching users : ' + members.map(member => member.user.username).join(', ')))
            .catch(error => {
                console.error('error on fetching members');

                console.error(error);
            })
        ;
    }
}
