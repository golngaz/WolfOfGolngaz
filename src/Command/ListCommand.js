const GameCommand = require('./GameCommand')

module.exports = class ListCommand {
    /**
     * @param message
     * @param {string[]} args
     * @param {Di} di
     */
    static execute(message, args, di) {
        var game = new GameCommand(message, di.db);

        message.reply(game.roleMap.map(roleClass => (new roleClass()).label()).join(', '))

        return Promise.resolve()
    }
}
