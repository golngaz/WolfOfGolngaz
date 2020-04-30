/**
 * Un joueur est un membre composé d'un role
 */
import {GuildMember, Message, MessageAdditions, MessageOptions, StringResolvable} from "discord.js";

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

    /**
     * @return {string}
     */
    label(): string {
        throw new Error('To implement');
    }

    /**
     * @param {Player} player
     *
     * @return {Player}
     */
    static fromPlayer(player) {
        return new this(player.member);
    }

    send(message?: StringResolvable, options?: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message> {
        return this.member.send(message, options);
    }
}
