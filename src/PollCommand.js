const SimpleVillager = require('./Game/SimpleVillager')
const Werewolf = require('./Game/Werewolf')
const Witch = require('./Game/Witch')
const NoRole = require('./Game/NoRole')
const Seer = require('./Game/Seer')
const Angel = require('./Game/Angel')
const Hunter = require('./Game/Hunter')
const Saving = require('./Game/Saving')
const Cupid = require('./Game/Cupid')
const GuildMember = require('discord.js/src/structures/GuildMember')

module.exports = class KillCommand {
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
}
