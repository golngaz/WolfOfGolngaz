import {GuildMember} from "discord.js";
import Player from "./Player";

export default class Saving extends Player {
    constructor(member: GuildMember) {
        super(member);
    }

    static key() {
        return 'saving'
    }

    label() {
        return 'Salvateur'
    }
}