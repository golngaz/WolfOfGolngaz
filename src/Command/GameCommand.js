const SimpleVillager = require('../Game/SimpleVillager')
const Werewolf = require('../Game/Werewolf')
const NoRole = require('../Game/NoRole')
const PlayerFactory = require('../Game/PlayerFactory')
const AbstractCommand = require('./AbstractCommand')
const GameService = require('./GameService')

module.exports = class GameCommand extends AbstractCommand {
    constructor(message, db) {
        super()
        this.error = ''

        this.message = message
        this.guild = message.guild
        this.gameMaster = message.author
        this.db = db
        this.guildDb = GameService.initDb(this.db, this.guild.id)

        this.gameChannel = this.guild.channels
            .filter(channel => channel.name === 'village' && channel.type === 'text')
            .first()

        this.wolfChannel = this.guild.channels
            .filter(channel => channel.name === 'loup-garous' && channel.type === 'text')
            .first()

        this.players = this.guild.members
            .filter(member => member.roles.some(role => role.name === 'jeu'))
            .map(member => new NoRole(member))

        this.roleMap = this.guildDb.get('config.roles').value().map(key => PlayerFactory.mapping()[key])
    }

    static execute(message, args, di) {
        let game = new this(message, di.db)

        return game.init().catch(console.error)
    }

    /**
     * @return {Promise}
     */
    init() {
        this.gameMaster.send('Init de la partie..')

        if (!this.canPlay()) {
            return this.message.reply(this.error)
        }

        this._completeRoleMap()

        let players = this.players.slice()
        this.players = []

        this.roleMap.forEach(roleClass => {
            let randomPlayer = players.splice(Math.floor(Math.random() * players.length), 1)[0]

            this.players.push(roleClass.fromPlayer(randomPlayer))
        })


        this._notifyPlayersRole()

        this._saveGame()

        this._removeDeathRole()

        return this.initWolfChannel(this.players.filter(player => player.is(Werewolf.key())))
            .then(() => this.gameChannel.send('Le jeu commence avec les roles ' + this.displayRoles()))
    }

    _saveGame() {
        let playersData = []
        this.players.forEach(player => {
            playersData.push({
                memberId: player.member.id,
                roleKey: player.constructor.key(),
                data: {}
            })
        })

        this.guildDb.value().game = {
            active: true,
            time: 'night',
            masterMemberId: this.gameMaster.id,
            players: playersData,
        }

        this.guildDb.write()
    }

    _completeRoleMap() {
        let roleLength = this.roleMap.length
        // complète les roles initiaux avec des simples villageois
        for (let i = 0 ; i < (this.players.length - roleLength) ; i++) {
            this.roleMap.push(SimpleVillager)
        }
    }

    _notifyPlayersRole() {
        let recapGameMaster = ''
        this.players.forEach(player => {
            player.send('Tu es ' + player.label() + ' !')
            recapGameMaster += player.member + ' est **' + player.label() + '**\n'
        })

        return this.gameMaster.send(recapGameMaster)
    }

    /**
     * @return {boolean}
     */
    canPlay() {
        if (this.players.length < this.roleMap.length) {
            this.error = 'Le nombre de joueurs est insuffisant pour lancer une partie, il doit y avoir au moins ' + this.roleMap.length + ' joueurs'

            return false
        }

        if (this.hasOffline()) {
            this.error = 'Certains joueurs sont déconnectés'

            return false
        }

        if (!this.wolfChannel) {
            this.error = 'Salon des loups introuvable'

            return false
        }

        if (this.gameMasterIsPlayer()) {
            this.error = 'Le MJ ne doit pas faire partie des joueurs '

            return false
        }

        return true
    }

    /**
     * @return {boolean}
     */
    hasOffline() {
        return this.players.some(player => player.member.presence.status === 'offline')
    }

    /**
     * @return {boolean}
     */
    gameMasterIsPlayer() {
        return this.players.some(player => player.member.user.username === this.gameMaster.username)
    }

    displayRoles() {
        return this.players
            .filter(player => !player.is(SimpleVillager.key()))
            .map(player => player.label())
            .join(', ')
    }

    /**
     * @param {Player=} player
     */
    _removeDeathRole(player) {
        var deathRole = this.guild.roles.filter(role => role.name === 'mort').first()

        var players = player ? [player] : this.players.filter(player => player.member.roles.some(role => role.name === 'mort'))

        players.forEach(player => player.member.removeRole(deathRole))
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
                this.wolfChannel.overwritePermissions(member, {READ_MESSAGES: false})
                    .catch(console.error)
            })

        let addPermissions = []

        wolfs.forEach(wolf => {
            addPermissions.push(
                this.wolfChannel.overwritePermissions(wolf.member.user, {READ_MESSAGES: true})
                    .then(() => this.wolfChannel.send('Bienvenue chez les loups ' + wolf.member))
                    .catch(console.error)
            )
        })

        return Promise.all(addPermissions)
            .then(this.wolfChannel.send('Vous êtes des loups, vous devez manger des gens la nuit ! Interdiction d\'utiliser ce canal la nuit (le mj surveille !!)'))
    }
}
