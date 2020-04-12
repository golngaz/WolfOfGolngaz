
module.exports = class AbstractCommand {
    static execute(message, args, di) {
        throw Error('To implement')
    }

    /**
     * Renvoie la signature de la commande
     */
    static signature() {
        return ''
    }

    /**
     * Affiche l'aide de la commande
     */
    static help() {
        return 'Il n\'y a pas de documentation pour cette commande'
    }
}
