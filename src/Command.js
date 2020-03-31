module.exports = class Command {
    static handle(stringCommand) {
        let args = stringCommand.split(' ')


        if (args.shift() === 'wog') {
            this.execute(args)
        }
    }
}
