const AbstractCommand = require('../AbstractCommand')
const ConfigRoleService = require('./ConfigRoleService')

module.exports = class ConfigCommand extends AbstractCommand {
    static execute(message, args, di) {
        let config = di.db.get('guilds')
            .find({id: message.guild.id})
            .get('config')
            .value()

        if (!args[0]) {
            return message.reply('Vous devez préciser le noeud de la config')
        }

        if (args[0] === 'roles' || args[0] === 'role') {
            args.shift()
            return di.get(ConfigRoleService).handle(message, args)
        }

        // @todo raccourcis à supprimer ou non (selon si la config gère autre chose)
        return di.get(ConfigRoleService).handle(message, args)
    }

    static signature() {
        return '[[role(s)] add|remove role_clé (exemple: fox)]'
    }

    static help() {
        return 'Permet de gérer la configuration d\'une partie'
    }
}
