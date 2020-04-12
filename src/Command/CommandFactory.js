
module.exports = class CommandFactory {

    /**
     * @return {object<(function(): Class)>}
     */
    static gameMasterCommandList() {
        return {
            debug: () => require('./DebugCommand'),
            start: () => require('./GameCommand'),
            kill: () => require('./KillCommand'),
            poll: () => require('./PollCommand'),
            reset: () => require('./ResetCommand'),
            time: () => require('./TimeCommand'),
        }
    }

    /**
     * @return {object<(function(): Class)>}
     */
    static freeCommandList() {
        return {
            join: () => require('./JoinCommand'),
            list: () => require('./ListCommand'),
            roles: () => require('./RolesCommand'),
        }
    }

    static handle(message, di) {
        let args = message.content.split(' ')

        if (args.shift() === 'wog') {
            let stringCommand = args.shift()

            let command = this.gameMasterCommandList()[stringCommand]
            if (command) {
                if (message.author.username !== 'golngaz' || message.author.discriminator !== '8508') {
                    return message.reply('Vous n\'êtes pas autorisé à faire de commande !')
                }
            }

            command = command || this.freeCommandList()[stringCommand]

            if (!command) {
                return message.reply('Commande inconnue !')
            }

            command().execute(message, args, di)
                .catch(console.error)
        }
    }
}
