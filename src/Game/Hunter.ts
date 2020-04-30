import {GuildMember} from "discord.js";
import Player from "./Player";

export default class Hunter extends Player {
    constructor(member: GuildMember) {
        super(member);
    }

    static key() {
        return 'hunter'
    }

    label() {
        return 'Chasseur'
    }
}