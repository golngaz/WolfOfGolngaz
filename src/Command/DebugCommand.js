const Permissions = require('discord.js/src/util/Permissions')
const GameCommand = require('./GameCommand')

module.exports = class DebugCommand {
    static execute(message, args, di) {
        let game = new GameCommand(message.guild, message.author);

        message.reply(game.roleMap.map(roleClass => (new roleClass()).label()).join(', '))

        return Promise.resolve()
    }
}
