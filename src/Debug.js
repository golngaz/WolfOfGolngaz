const Permissions = require('discord.js/src/util/Permissions')
const GameCommand = require('./GameCommand')

module.exports = class Debug {
    /**
     * @param message
     * @param {string[]} args
     */
    static execute(message, args) {
        var game = new GameCommand(message.guild, message.author);

        message.reply(game.roleMap.map(roleClass => (new roleClass()).label()).join(', '))

        return Promise.resolve()
    }
}
