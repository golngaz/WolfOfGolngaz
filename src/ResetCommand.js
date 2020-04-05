module.exports = class ResetCommand {
    /**
     * @param message
     * @param {string[]} args
     */
    static execute(message, args) {
        var gameRole = message.guild.roles.filter(role => role.name === 'jeu').first()
        var diedRole = message.guild.roles.filter(role => role.name === 'mort').first()

        message.guild.members.forEach(member => member.removeRole(diedRole))
        message.guild.members.forEach(member => member.setMute(false))

        if (!(args[0] && args === 'soft')) {
            message.guild.members.forEach(member => member.removeRole(gameRole))
        }

        return message.reply('Les joueurs sont réinitialisés')
    }
}
