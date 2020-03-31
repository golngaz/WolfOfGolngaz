

const CommandList = {
    debug: () => require('./Debug')
}

module.exports = class CommandFactory {
    static handle(message) {
        let args = message.content.split(' ')

        if (args.shift() === 'wog') {
            let stringCommand = args.shift()

            let key = Object.keys(CommandList)
                .filter(key => key === stringCommand)[0]

            if (!key) {
                return message.reply('Commande inconnue !')
            }

            return CommandList[key]().execute(message, args)
        }
    }
}
