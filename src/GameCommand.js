const SimpleVillager = require('./Game/SimpleVillager')
const Werewolf = require('./Game/Werewolf')
const Witch = require('./Game/Witch')
const NoRole = require('./Game/NoRole')
const Seer = require('./Game/Seer')
const Angel = require('./Game/Angel')
const Hunter = require('./Game/Hunter')

module.exports = class GameCommand {
    constructor(guild, gameMaster) {
        this.error = ''

        this.guild = guild
        this.gameMaster = gameMaster

        this.gameChannel = guild.channels
            .filter(channel => channel.name === 'village' && channel.type === 'text')
            .first()

        this.wolfChannel = guild.channels
            .filter(channel => channel.name === 'loup-garous' && channel.type === 'text')
            .first()

        this.players = guild.members
            .filter(member => member.roles.some(role => role.name === 'jeu'))
            .map(member => new NoRole(member))

        console.debug('Lancement du jeu avec ' + this.players.length + ' personnes : ' + this.players.map(player => player.member.user.username).join(', '))

        // @todo rendre configurable depuis la commande init ?
        this.roleMap = [Werewolf, Werewolf, Witch, Seer, Angel, Hunter]
    }

    /**
     * @return {boolean}
     */
    canPlay() {
        if (this.players.length <= this.roleMap.length) {
            this.error = 'Le nombre de joueurs est insuffisant pour lancer une partie, il doit y avoir au moins ' + this.roleMap.length + ' joueurs'

            return false
        }

        if (!this.wolfChannel) {
            this.error = 'Salon des loups introuvable'

            return false
        }

        if (this.players.some(player => player.member.user.username === this.gameMaster.username)) {
            this.error = 'Le MJ ne doit pas faire partie des joueurs '

            return false
        }

        return true
    }

    /**
     * @return {Promise}
     */
    init(message) {
        if (!this.canPlay()) {
            message.reply(this.error)

            return Promise.reject(this.error)
        }

        let roleLength = this.roleMap.length
        // complète les roles initiaux avec des simples villageois
        for (let i = 0 ; i < (this.players.length - roleLength) ; i++) {
            this.roleMap.push(SimpleVillager)
        }

        let players = this.players.slice()
        this.players = []

        this.roleMap.forEach(roleClass => {
            var randomPlayer = players.splice(Math.floor(Math.random() * players.length), 1)[0]

            this.players.push(roleClass.fromPlayer(randomPlayer))
        })

        this.players.forEach(player => {
            player.send('Tu es ' + player.label() + ' !')
            this.gameMaster.send(player.member + ' est ' + player.label())
        })

        return this.initWolfChannel(this.players.filter(player => player.is(Werewolf.key())))
            .then(() => {
                this.gameChannel.send('Le jeu commence avec les roles ' + this.displayRoles())
            })
    }

    displayRoles() {
        return this.players.filter(player => !player.is(SimpleVillager.key())).map(player => player.label()).join(', ')
    }

    /**
     * @param message
     * @param {string[]} args
     */
    static execute(message, args) {
        let game = new this(message.guild, message.author)

        return game.init(message).catch(console.error)
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
