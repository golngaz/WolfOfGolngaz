const AbstractCommand = require('./AbstractCommand')

module.exports = class JoinCommand extends AbstractCommand {
    static execute(message, args, di) {
        var gameRole = message.guild.roles.cache.filter(role => role.name === 'jeu').first()

        message.guild.member(message.author).addRole(gameRole)
            .catch(console.error)

        return message.reply(message.author + ' tu as rejoint la prochaine partie')
    }

    static help() {
        return 'Permet de rejoindre la prochaine partie'
    }
}
