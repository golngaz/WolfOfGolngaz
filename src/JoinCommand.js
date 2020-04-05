module.exports = class JoinCommand {
    /**
     * @param message
     * @param {string[]} args
     */
    static execute(message, args) {
        var gameRole = message.guild.roles.filter(role => role.name === 'jeu').first()

        message.guild.member(message.author).addRole(gameRole)

        return message.reply(message.author + ' tu as rejoint la prochaine partie')
    }
}
