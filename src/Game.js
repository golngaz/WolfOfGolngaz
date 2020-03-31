module.exports = class Game {
    /**
     * @param message
     * @param {string[]} args
     */
    static execute(message, args) {
        let players = message.guild.members.filter((member) => {
            return member.roles.some(role => role.name === 'jeu')
        })

        let wolfs = this.initRoles(players)

        if (!wolfs.length) {
            message.reply('Il n\'y a pas assez de joueur pour lancer une partie')
        }

        let wolfChannel = this.initWolfChannel(message.guild, wolfs)

        if (wolfChannel) {
            message.reply('j ai trouvé le salon de loups : ' + wolfChannel.name + ', golngaz à les roles ' + wolfChannel.permissionsFor(message.author).serialize())

            return
        }

        return message.reply('je n ai pas trouvé le salon')
    }

    static initRoles(players) {
        // @todo
        return players
    }

    /**
     * @param guild
     * @param users users who are werewolf
     * @return {TextChannel}
     */
    static initWolfChannel(guild, users) {
        let wolfChannel = guild.channels
            .filter(function(channel) {
                return channel.name === 'loup-garous' && channel.type === 'text'
            })
            .first()

        users.forEach((user) => {
            wolfChannel.overwritePermissions(user, {READ_MESSAGES: true})
                .then(() => wolfChannel.send('ok pour les droits des loups'))
                .catch(console.error)
        })

        return wolfChannel
    }
}
