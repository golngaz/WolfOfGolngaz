const Permissions = require('discord.js/src/util/Permissions')

module.exports = class Debug {
    /**
     * @param message
     * @param {string[]} args
     */
    static execute(message, args) {
        let channel = message.guild.channels.filter((channel) => {
            return channel.name === 'loup-garous'
        }).first()

        let rudy = message.guild.members.filter((member) => {
            return member.user.username === 'Extramood'
        }).first()

        if (!channel || !rudy) {
            message.reply('ne trouve pas')
        }

        channel.overwritePermissions(rudy, {READ_MESSAGES: true})
            .then(() => {
                console.log(channel.permissionsFor(message.author).has(Permissions.FLAGS.READ_MESSAGES))
                console.log(channel.permissionsFor(rudy).has(Permissions.FLAGS.READ_MESSAGES))
            })

        message.reply('ok')

        return Promise.resolve()
    }
}
