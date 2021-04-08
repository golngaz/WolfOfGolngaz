import {Message, PartialMessage} from 'discord.js';
import Di from "../Di";

class AbstractCommand {
    constructor(...params) {
        // @fixme permet uniquement le typage en typeof AbstractCommand pour les commandes aillant un constructeur
    }

    static execute(message: Message|PartialMessage, args: string[], di: Di): Promise<any> | null {
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

    /**
     * Retourne true si la commande n'est effective que lorsqu'une partie est en cours,
     * false si elle n'est utilisable uniquement lorsqu'aucune partie n'est en cours
     *
     * Si null, la commande est utilisable partout
     */
    public static isInGame(): boolean | null {
        return null;
    }

    /**
     * Retourne true si la commande n'est effective que pour le MJ
     */
    public static isGameMasterOnly(): boolean {
        return false;
    }
}

export = AbstractCommand;
