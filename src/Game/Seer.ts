import Player from "./Player";
import {GuildMember} from "discord.js";

export default class Seer extends Player {
    constructor(member: GuildMember) {
        super(member);
    }

    static key() {
        return 'seer'
    }

    label() {
        return 'Voyante'
    }
}