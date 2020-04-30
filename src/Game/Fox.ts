import {GuildMember} from "discord.js";
import Player from "./Player";

export default class Fox extends Player {
    constructor(member: GuildMember) {
        super(member);
    }

    static key() {
        return 'fox'
    }

    label() {
        return 'Renard'
    }
}
