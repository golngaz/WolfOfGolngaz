const AbstractCommand = require('./AbstractCommand')

module.exports = class LeaveCommand extends AbstractCommand {
    static execute(message, args, di) {
        var gameRole = message.guild.roles.cache.filter(role => role.name === 'jeu').first()

        message.guild.member(message.author).removeRole(gameRole)
            .catch(console.error)

        return message.reply(message.author + ' tu as quitté la prochaine partie')
    }

    static help() {
        return 'Permet de ne pas rejoindre la prochaine partie'
    }
}
