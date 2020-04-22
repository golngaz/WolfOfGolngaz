const Permissions = require('discord.js/src/util/Permissions')
const GameCommand = require('./GameCommand')
const AbstractCommand = require('./AbstractCommand')

module.exports = class DebugCommand extends AbstractCommand {
    static execute(message, args, di) {
        return message.guild.channels
            .filter(channel => channel.name === 'commands' && channel.type === 'text')
            .first()
            .send('_stop')
    }
}
