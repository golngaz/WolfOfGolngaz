import {Message, PartialMessage} from 'discord.js';
import Di from "../Di";

class AbstractCommand {
    static execute(message: Message|PartialMessage, args: string[], di: Di) {
        throw Error('To implement')
    }

    /**
     * Renvoie la signature de la commande
     */
    static signature(): string {
        return ''
    }

    /**
     * Affiche l'aide de la commande
     */
    static help(): string {
        return 'Il n\'y a pas de documentation pour cette commande'
    }
}

export = AbstractCommand;