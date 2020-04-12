const Shaman = require('../Game/Shaman')

module.exports = class GameService {
    constructor(di, guild) {
        this.guild = guild
        this.db = di.db
        this.guildDb = this.db.get('guilds').find({id: this.guild.id})

        if (!this.guildDb.value().id) {
            this._initDb()
        }
    }

    /**
     * Est-ce qu'une partie est en cours
     */
    isRunning() {
        return this.guildDb.get('game').value().active === true
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
            let memberShaman = message.guild.members
                .filter(member => member.id === shaman.memberId)
                .filter(member => member.roles.some(role => role.name === 'jeu'))
                .filter(member => !member.roles.some(role => role.name === 'mort'))
                .first()

            if (memberShaman) {
                return memberShaman
                    .send('Mort : "*' + message.content + '*"')
            }
        }
    }

    _initDb() {
        let defaultGuildDb = {
            id: this.guild.id,
            masterMemberId: null,
            game: {
                active: false,
                players: [

                ]
            },
            time: 'night'
        }

        this.db.get('guilds').push(defaultGuildDb).write()

        this.guildDb = this.db.get('guilds').find({id: this.guild.id})
    }
}
