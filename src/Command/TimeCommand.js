const GameCommand = require('./GameCommand')

module.exports = class TimeCommand {
    /**
     * @param message
     * @param {string[]} args
     * @param {Di} di
     */
    static execute(message, args, di) {
        if (!args[0] || args[0] !== 'day' && args[0] !== 'night') {
            return message.reply('vous devez préciser day/night')
        }

        let time = args[0]

        let guildDb = di.db.get('guilds').find({id: message.guild.id})

        if (guildDb.value().game.active !== true) {
            return message.reply('Aucune partie en cours')
        }

        if (guildDb.value().game.time === time) {
            return message.reply('il fait déjà ' + this._translate(time) + ' dans le village !')
        }

        guildDb.value().game.time = time

        guildDb.write()

        let playerRole = message.guild.roles.filter(role => role.name === 'jeu').first()

        return message.guild.channels
            .filter(channel => channel.name === 'village' && channel.type === 'text')
            .first()
            .send(playerRole + ' ' + this.messageAnnounce(time))
    }

    static _translate(key) {
        return {
            day: 'jour',
            night: 'nuit'
        }[key]
    }

    static messageAnnounce(key) {
        return {
            day: 'Le jour vient de se lever au village',
            night: 'La nuit vient de tomber sur le village !'
        }[key]
    }
}