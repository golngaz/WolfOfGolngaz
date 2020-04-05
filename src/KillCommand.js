const NoRole = require('./Game/NoRole')

module.exports = class KillCommand {

    /**
     * @param message
     * @param {string[]} args
     */
    static execute(message, args) {
        if (!args[0]) {
            return message.reply('Vous devez préciser un nom de joueur')
        }

        var guild = message.guild;

        var memberToKill = message.guild.member(message.mentions.users.first())

        if (!memberToKill) {
            return message.reply('Joueur ' + args[0] + ' introuvable')
        }

        var gameChannel = guild.channels
            .filter(channel => channel.name === 'village' && channel.type === 'text')
            .first()

        var graveyard = guild.channels
            .filter(channel => channel.name === 'cimetière' && channel.type === 'text')
            .first()

        var deathRole = guild.roles.filter(role => role.name === 'mort').first()

        memberToKill.addRole(deathRole)
            .then(() => graveyard.send(memberToKill + ', tu viens de rejoindre le cimetière.. Bienvenue à toi !'))
            .catch(error => {
                message.reply('le rôle n\'a pas pû être ajouté ! Le bot n\'a peu être pas les droits')

                console.error(error)
            })

        memberToKill.setMute(true)

        var reason = ''

        if (args[1]) {
            reason = '(Raison : **'+args[1]+'**)'
        }

        return gameChannel.send('Le joueur ' + memberToKill + ' est mort.. Rip ' + reason)
    }
}
