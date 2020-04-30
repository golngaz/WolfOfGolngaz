import Player from "./Player";
import {GuildMember} from "discord.js";

export default class Witch extends Player {
    constructor(member: GuildMember) {
        super(member);
    }

    static key() {
        return 'witch'
    }

    label() {
        return 'Sorcière'
    }
}