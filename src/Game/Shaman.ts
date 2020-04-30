import Player from "./Player";
import {GuildMember} from "discord.js";

export default class Shaman extends Player {
    constructor(member: GuildMember) {
        super(member);
    }

    static key() {
        return 'shaman'
    }

    label() {
        return 'Chaman'
    }
}