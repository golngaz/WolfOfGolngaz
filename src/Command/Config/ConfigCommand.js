
module.exports = class ConfigCommand {
    constructor() {
        db.get('guilds').find({id: guild.id}).value()
    }

    static execute(message, args, di) {
        let config = di.db.get('guilds')
            .find({id: message.guild.id})
            .get('config')
            .default({})
            .value()

        if (args[0]) {

        }
    }
}
