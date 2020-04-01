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
        //
        // if (wolfChannel) {
        //     message.reply('j ai trouvé le salon de loups : ' + wolfChannel.name + ', golngaz à les roles ' + wolfChannel.permissionsFor(message.author).serialize())
        //
        //     return
        // }
        //
        // return message.reply('je n ai pas trouvé le salon')
    }

    static initRoles(players) {
        // @todo
        return players
    }

    /**
     * @param guild
     * @param wolfs members who are werewolf
     *
     * @return {Promise}
     */
    static initWolfChannel(guild, wolfs) {
        let wolfChannel = guild.channels
            .filter(function(channel) {
                return channel.name === 'loup-garous' && channel.type === 'text'
            })
            .first()

        wolfChannel.members
            .filter(member => member.user.username !== 'WolfOfGolngaz')
            .filter(member => wolfs.some(wolf => wolf.user.username !== member.user.username))
            .forEach(member => {
                wolfChannel.overwritePermissions(member, {READ_MESSAGES: false})
                    .then(() => console.log('suppression des droits loup garou pour ' + member.user.username + ' ok'))
                    .catch(console.error)
            })

        let addPermissions = [];

        wolfs
            .filter(member => member.user.username !== 'belaf13') // @todo supprimer c'est pour le test
            .forEach(wolf => {
            addPermissions.push(wolfChannel.overwritePermissions(wolf, {READ_MESSAGES: true})
                .then(() => wolfChannel.send('Bienvenue chez les loups ' + wolf))
                .catch(console.error)
            )
        })

        return Promise.all(addPermissions)
            .then(
                wolfChannel.send('Vous êtes des loups, vous devez manger des gens la nuit ! Interdiction d\'utiliser ce canal la nuit (le mj surveille !!)')
            )
    }
}
