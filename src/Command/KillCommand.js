const PlayerFactory = require('../Game/PlayerFactory')
const AbstractCommand = require('./AbstractCommand')

module.exports = class KillCommand extends AbstractCommand {

    static execute(message, args, di) {
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

        let memberDb = di.db.get('guilds').find({id: message.guild.id}).get('game.players').find({memberId: memberToKill.id}).value()

        if (!memberDb) {
            message.reply('Le joueur n\'a pas été trouvé dans la partie')
        }

        let player = PlayerFactory.get(memberDb.roleKey, memberToKill)

        return gameChannel.send('Le joueur ' + memberToKill + ', qui était "**' + player.label() + '**" est mort.. Rip ' + reason)
    }

    static signature() {
        return '@joueur [raison]'
    }

    static help() {
        return 'Tue une personne dans le jeu'
    }
}
