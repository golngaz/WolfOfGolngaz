const ResetService = require('./ResetService')

module.exports = class ResetCommand {
    /**
     *
     */
    static execute(message, args, di) {
        /** @type {ResetService} service */
        let service = di.get(ResetService.name)

        let members = message.guild.members.filter(member => member.roles.some(role => role.name === 'jeu'))

        service.resetMembers(members, args[0] && args[0] === 'soft')

        return message.reply('Les joueurs sont réinitialisés')
    }
}
