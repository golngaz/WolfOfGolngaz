const ResetService = require('./ResetService')
const AbstractCommand = require('./AbstractCommand')

module.exports = class ResetCommand extends AbstractCommand {
    static execute(message, args, di) {
        /** @type {ResetService} service */
        let service = di.get(ResetService.name)

        let members = message.guild.members.filter(member => member.roles.some(role => role.name === 'jeu'))

        service.resetMembers(members, args[0] && args[0] === 'soft')

        return message.reply('Les joueurs sont réinitialisés')
    }

    static signature() {
        return '[soft]'
    }

    static help() {
        return 'Permet de réinitialiser une partie\nsoft : n\'enlève pas les joueurs de la prochaine partie'
    }
}
