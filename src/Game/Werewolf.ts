import Player from "./Player";
import {GuildMember} from "discord.js";

export default class Werewolf extends Player {
    constructor(member: GuildMember) {
        super(member);
    }

    static key() {
        return 'werewolf'
    }

    label() {
        return 'Loup-Garou'
    }
}