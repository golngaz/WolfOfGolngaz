module.exports = class CommandFactory {

    /**
     * @return {object<(function(): Command)>}
     */
    static gameMasterCommandList() {
        return {
            debug: () => require('./DebugCommand'),
            start: () => require('./GameCommand'),
            kill: () => require('./KillCommand'),
            poll: () => require('./PollCommand'),
            reset: () => require('./ResetCommand'),
        }
    }

    /**
     * @return {object<(function(): Command)>}
     */
    static freeCommandList() {
        return {
            join: () => require('./JoinCommand'),
            list: () => require('./ListCommand'),
        }
    }

    static handle(message, db) {
        let args = message.content.split(' ')

        if (args.shift() === 'wog') {
            let stringCommand = args.shift()

            var command = this.constructor.gameMasterCommandList()[stringCommand]
            if (command) {
                if (message.author.username !== 'golngaz' || message.author.discriminator !== '8508') {
                    return message.reply('Vous n\'êtes pas autorisé à faire de commande !')
                }
            }

            command = command || this.constructor.freeCommandList()[stringCommand]

            if (!command) {
                return message.reply('Commande inconnue !')
            }

            command().execute(message, args, db)
                .then(() => console.log('commande executé'))
                .catch(console.error)
        }
    }
}
