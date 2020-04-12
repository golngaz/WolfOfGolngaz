const AbstractCommand = require('./AbstractCommand')

module.exports = class KillCommand extends AbstractCommand {
    /**
     * @param message
     * @param {string[]} args
     */
    static execute(message, args) {
        var guild = message.guild;

        var gameChannel = guild.channels
            .filter(channel => channel.name === 'village' && channel.type === 'text')
            .first()

        // @todo voir si ya un encapsule méthode
        var membersPolls = guild.members
            .filter(member => member.roles.some(role => role.name === 'jeu'))
            .filter(member => !member.roles.some(role => role.name === 'mort'))
            .map(member => {
                return member.toString()
            })
            .join('" "')

        return gameChannel.send('/poll "Voter pour éliminer.." "' + membersPolls + '"')
    }

    static help() {
        return 'Génère un vote de villageois sur tous les villageois vivant'
    }
}
