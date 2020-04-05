

const CommandList = {
    debug: () => require('./Debug'),
    start: () => require('./GameCommand'),
    kill: () => require('./KillCommand'),
    poll: () => require('./PollCommand'),
    reset: () => require('./ResetCommand'),
}

const FreeCommandList = {
    join: () => require('./JoinCommand'),
}

module.exports = class CommandFactory {
    static handle(message) {
        let args = message.content.split(' ')

        if (args.shift() === 'wog') {
            let stringCommand = args.shift()

            var command = CommandList[stringCommand]
            if (command) {
                if (message.author.username !== 'golngaz' || message.author.discriminator !== '8508') {
                    return message.reply('Vous n\'êtes pas autorisé à faire de commande !')
                }
            }

            command = command || FreeCommandList[stringCommand]

            if (!command) {
                return message.reply('Commande inconnue !')
            }

            command().execute(message, args)
                .then(() => console.log('commande executé'))
                .catch(console.error)
        }
    }
}
