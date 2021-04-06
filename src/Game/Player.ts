/**
 * Un joueur est un membre composé d'un role
 */
import {GuildMember, Message, MessageAdditions, MessageOptions, StringResolvable} from "discord.js";

export default class Player {
    public member: GuildMember;

    private playerDb: any;

    constructor(member: GuildMember, playerDb: any = null) {
        // @todo enlever le null par défaut
        this.member = member;
        this.playerDb = playerDb
    }

    is(classKey: string) {
        return (<any>this.constructor).key() === classKey;
    }

    /**
     * @return {string}
     */
    static key() {
        throw new Error('To implement');
    }

    isDead(): boolean {
        return !!this.member.roles.cache.filter(role => role.name === 'mort').first()
    }

    toString(): string {
        let response: string = '';

        response += this.member.toString() + ' - **' + this.label() + '**'

        if (this.isDead()) {
            return ['~~', '~~'].join(response);
        }

        return response;
    }

    /**
     * @return {string}
     */
    label(): string {
        throw new Error('To implement');
    }

    send(message?: StringResolvable, options?: MessageOptions): Promise<Message | Message[]> {
        return this.member.send(message, options);
    }
}
