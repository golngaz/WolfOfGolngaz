import Player from "./Player";
import {GuildMember} from "discord.js";

export default class Cupid extends Player {
    constructor(member: GuildMember) {
        super(member);
    }

    static key() {
        return 'cupid';
    }

    label() {
        return 'Cupidon';
    }
}