import AbstractCommand from "./AbstractCommand";
import GameService from "./GameService.js";
import Player from "../Game/Player.js";
import NoRole from "../Game/NoRole.js";
import Werewolf from "../Game/Werewolf.js";
import SimpleVillager from "../Game/SimpleVillager.js";
import PlayerFactory from "../Game/PlayerFactory.js";
import {Guild, Message, PartialMessage, TextChannel, User} from "discord.js";
import Di from "../Di";

class GameCommand extends AbstractCommand {
    private error: string;
    private message: Message|PartialMessage;
    private guild: Guild;
    private gameMaster: User;
    private db: any; // @fixme real type
    private guildDb: any; // @fixme real type
    private gameChannel: TextChannel;
    private wolfChannel: TextChannel;
    private players: Player[];
    public roleMap: any; // @fixme real type // @todo private

    constructor(message: Message|PartialMessage, guild: Guild, author: User, db: any) {
        super();
        this.error = '';

        this.message = message;
        this.guild = guild;
        this.gameMaster = author;
        this.db = db;
        this.guildDb = GameService.initDb(this.db, this.guild.id);

        this.gameChannel = this.guild.channels.cache
            .filter(channel => channel.name === 'village' && channel.type === 'text')
            .first() as TextChannel
        ;

        this.wolfChannel = this.guild.channels.cache
            .filter(channel => channel.name === 'loup-garous' && channel.type === 'text')
            .first() as TextChannel
        ;

        this.players = this.guild.members.cache
            .filter(member => member.roles.cache.some(role => role.name === 'jeu'))
            .map(member => new NoRole(member))
        ;

        this.roleMap = this.guildDb.get('config.roles').value().map((key: string) => PlayerFactory.mapping()[key]);
    }

    static execute(message: Message|PartialMessage, args: string[], di: Di): Promise<any> {
        if (!message.guild || !message.author) {
            return Promise.reject();
        }

        let game = new this(message, message.guild, message.author, di.db);

        return game.init().catch(console.error);
    }

    /**
     * @return {Promise}
     */
    async init() {
        if (!this.canPlay()) {
            return this.message.reply?.(this.error);
        }

        this.gameMaster.send('Init de la partie..')

        this._completeRoleMap()

        let players = this.players.slice();
        this.players = [];

        this.roleMap.forEach((roleClass: Player) => {
            let randomPlayer = players.splice(Math.floor(Math.random() * players.length), 1)[0];

            this.players.push((<any>roleClass).fromPlayer(randomPlayer));
        });

        await this._notifyPlayersRole();

        this._saveGame();

        this._removeDeathRole();

        return this.initWolfChannel(this.players.filter(player => player.is(Werewolf.key())))
            .then(() => this.gameChannel.send('Le jeu commence avec les roles ' + this.displayRoles()));
    }

    _saveGame() {
        let playersData: object[] = [];
        this.players.forEach(player => {
            playersData.push({
                memberId: player.member.id,
                roleKey: (<any>player.constructor).key(),
                data: {}
            })
        });

        this.guildDb.value().game = {
            active: true,
            time: 'night',
            masterMemberId: this.gameMaster.id,
            players: playersData,
        };

        this.guildDb.write();
    }

    _completeRoleMap() {
        let roleLength = this.roleMap.length;
        // complète les roles initiaux avec des simples villageois
        for (let i = 0 ; i < (this.players.length - roleLength) ; i++) {
            this.roleMap.push(SimpleVillager);
        }
    }

    _notifyPlayersRole() {
        let recapGameMaster = '';
        this.players.forEach(player => {
            player.send('Tu es ' + player.label() + ' !');
            recapGameMaster += player.member.toString() + ' est **' + player.label() + '**\n';
        });

        return this.gameMaster.send(recapGameMaster);
    }

    /**
     * @return {boolean}
     */
    canPlay() {
        if (this.players.length < this.roleMap.length) {
            this.error = 'Le nombre de joueurs est insuffisant pour lancer une partie, il doit y avoir au moins ' + this.roleMap.length + ' joueurs';

            return false;
        }

        if (this.hasOffline()) {
            this.error = 'Certains joueurs sont déconnectés : ' + this.hasOffline()[0].toString();

            return false;
        }

        if (!this.wolfChannel) {
            this.error = 'Salon des loups introuvable';

            return false;
        }

        if (this.gameMasterIsPlayer()) {
            this.error = 'Le MJ ne doit pas faire partie des joueurs';

            return false;
        }

        return true;
    }

    /**
     * @return {boolean}
     */
    hasOffline() {
        return this.players.filter(player => player.member.presence.status === 'offline');
    }

    /**
     * @return {boolean}
     */
    gameMasterIsPlayer() {
        return this.players.some(player => player.member.user.username === this.gameMaster.username);
    }

    displayRoles() {
        return this.players
            .filter(player => !player.is(SimpleVillager.key()))
            .map(player => player.label())
            .join(', ')
        ;
    }

    /**
     * @param {Player=} player
     */
    _removeDeathRole(player?: Player) {
        var deathRole = this.guild.roles.cache.filter(role => role.name === 'mort').first();

        var players = player ? [player] : this.players.filter(player => player.member.roles.cache.some(role => role.name === 'mort'));

        players.forEach(player => player.member.roles.remove(deathRole));
    }

    /**
     * @param {Array<Player>} wolfs members who are werewolf
     *
     * @return {Promise}
     */
    initWolfChannel(wolfs) {
        this.wolfChannel.members
            .filter(member => member.user.username !== 'WolfOfGolngaz')
            .forEach(member => {
                this.wolfChannel.createOverwrite(member, {VIEW_CHANNEL: false})
                    .catch(console.error)
            })
        ;

        let addPermissions = [];

        wolfs.forEach(wolf => {
            addPermissions.push(
                this.wolfChannel.createOverwrite(wolf.member.user, {VIEW_CHANNEL: true})
                    .then(() => this.wolfChannel.send('Bienvenue chez les loups ' + wolf.member.toString()))
                    .catch(console.error)
            )
        });

        return Promise.all(addPermissions)
            .then(() => this.wolfChannel.send('Vous êtes des loups, vous devez manger des gens la nuit ! Interdiction d\'utiliser ce canal la nuit (le mj surveille !!)'))
        ;
    }
}

export = GameCommand;
