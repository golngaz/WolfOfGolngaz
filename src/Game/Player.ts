/**
 * Un joueur est un membre composé d'un role
 */
import {GuildMember, Message, MessageOptions, StringResolvable} from "discord.js";

export default class Player {
    public member: GuildMember;

    constructor(member: GuildMember) {
        this.member = member;
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

        response +=  + '**' + this.label() + '**'

        if (this.isDead()) {
            return ['~~', '~~'].join(this.member.toString() + ' - ' + response) + ' :skull:';
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
