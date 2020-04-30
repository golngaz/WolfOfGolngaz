import Player from "./Player";
import {GuildMember} from "discord.js";

export default class NoRole extends Player {
    constructor(member: GuildMember) {
        super(member);
    }

    static key() {
        return 'no-role'
    }

    label() {
        return 'Sans Rôle'
    }
}