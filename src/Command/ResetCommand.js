const ResetService = require('./ResetService')
const GameService = require('./GameService')
const AbstractCommand = require('./AbstractCommand')

module.exports = class ResetCommand extends AbstractCommand {
    static execute(message, args, di) {
        let members = message.guild.members.filter(member => member.roles.some(role => role.name === 'jeu'))

        di.get(GameService.name).end()

        if (!args[0]) {
            di.get(ResetService.name).resetMembers(members, false)

            return message.reply('Tous les joueurs sont réinitialisés')
        }

        if (args[0] === 'soft') {
            di.get(ResetService.name).resetMembers(members, true)

            return message.reply('Les joueurs sont réinitialisés mais restent pour la prochaine partie')
        }

        if (args[0] === 'config') {
            di.get(GameService.name).initConfig()

            return message.reply('La configuration à été réinitialisé')
        }

        return message.reply('Nani nani ??')
    }

    static signature() {
        return '[soft|config]'
    }

    static help() {
        return 'Permet de réinitialiser une partie\n' +
            'soft -> n\'enlève pas les joueurs de la prochaine partie\n' +
            'config -> réinitialise la configuration de la partie'
    }
}
