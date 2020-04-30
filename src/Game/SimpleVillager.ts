import {GuildMember} from "discord.js";
import Player from "./Player";

export default class SimpleVillager extends Player {
    constructor(member: GuildMember) {
        super(member);
    }

    static key() {
        return 'simple-villager'
    }

    label() {
        return 'Simple Villageois'
    }
}