import AbstractCommand from "./AbstractCommand";
import GameService from "./GameService.js";
import Player from "../Game/Player.js";
import NoRole from "../Game/NoRole.js";
import Werewolf from "../Game/Werewolf.js";
import SimpleVillager from "../Game/SimpleVillager.js";
import {Guild, Message, PartialMessage, TextChannel, User} from "discord.js";
import Di from "../Di";

/**
 * @todo renommer en StartCommand
 */
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
    public roleMap: Array<typeof Player>
    private gameService: GameService;

    constructor(message: Message|PartialMessage, guild: Guild, author: User, db: any, gameService: GameService) {
        super();
        this.error = '';

        this.message = message;
        this.guild = guild;
        this.gameMaster = author;
        this.db = db;

        // @todo supprimer
        this.guildDb = GameService.initDb(this.db, this.guild.id);
        this.gameService = gameService

        this.gameChannel = this.guild.channels.cache
            .filter(channel => channel.name === 'village' && channel.type === 'text')
            .first() as TextChannel
        ;

        this.wolfChannel = this.gameService.wolfChannel();

        this.players = this.guild.members.cache
            .filter(member => member.roles.cache.some(role => role.name === 'jeu'))
            .map(member => new NoRole(member))
        ;

        this.roleMap = this.gameService.roleMap();
    }

    static async execute(message: Message | PartialMessage, args: string[], di: Di): Promise<any> {
        if (!message.guild || !message.author) {
            return Promise.reject();
        }

        di.get(GameService).fetch()

        let game = new this(message, message.guild, message.author, di.db, di.get(GameService));

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

        this.roleMap.forEach((roleClass: typeof Player) => {
            let randomPlayer = players.splice(Math.floor(Math.random() * players.length), 1)[0];

            this.players.push(new roleClass(randomPlayer.member));
        });

        await this._notifyPlayersRole();

        this._saveGame();

        this.removeDeathRole();

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

        // @todo fixme la présence des joueurs est toujours offline maintenant
        // if (this.offlinePlayers()) {
        //     // @todo afficher la liste
        //     console.error(this.offlinePlayers().map(player => player.member.presence.status))
        //     this.error = 'Certains joueurs sont déconnectés : ' + this.offlinePlayers().map(player => player.member);
        //
        //     return false;
        // }

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

    // /**
    //  * @return {boolean}
    //  */
    // offlinePlayers() {
    //     return this.players.filter(player => player.member.presence.status === 'offline');
    // }

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
     * Supprime le role mort d'un joueur si précisé ou tous les joueurs
     */
    private removeDeathRole(player?: Player) {
        var players = player ? [player] : this.players.filter(player => player.member.roles.cache.some(role => role.name === 'mort'));

        players.forEach(player => player.member.roles.remove(this.gameService.role('mort')));
    }

    /**
     * @param {Array<Player>} wolfs members who are werewolf
     *
     * @return {Promise}
     */
    async initWolfChannel(wolfs) {
        await this.gameService.resetWolfChannel()

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

    public static isInGame(): boolean | null {
        return false;
    }
}

export = GameCommand;
