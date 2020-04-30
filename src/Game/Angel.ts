import Player from "./Player";
import {GuildMember} from "discord.js";

export default class Angel extends Player {
    constructor(member: GuildMember) {
        super(member);
    }

    static key(): string {
        return 'angel';
    }

    label() {
        return 'l\'Ange';
    }
}