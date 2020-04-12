const PlayerFactory = require('../Game/PlayerFactory')

module.exports = class RolesCommand {
    /**
     *
     */
    static execute(message, args, di) {
        let response = '```\n'
        let mapping = PlayerFactory.mapping()

        let largestKeyLength = Math.max(...Object.keys(mapping).map(key => key.length)) + 2

        Object.keys(mapping).forEach(key => {

            let tabulate = ' '.repeat(largestKeyLength - (key.length + 2))

            response += '[' + key + '] ' + tabulate + (new mapping[key]).label() + '\n'
        })

        response += '\n```'

        return message.channel.send(response)
    }
}
