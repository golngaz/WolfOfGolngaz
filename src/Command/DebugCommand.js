const Permissions = require('discord.js/src/util/Permissions')
const GameCommand = require('./GameCommand')

module.exports = class DebugCommand {
    static execute(message, args, di) {
        console.log(message.content, message.mentions)
        message.reply(message.content)
        return message.reply(message.mentions[0])
    }
}
