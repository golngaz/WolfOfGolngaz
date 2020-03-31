module.exports = class Debug {
    /**
     * @param message
     * @param {string[]} args
     */
    static execute(message, args) {
        return message.reply('debug : ' + args.join(', '))
    }
}
