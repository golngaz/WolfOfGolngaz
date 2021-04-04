import {GuildMember} from "discord.js";
import GameService from "./GameService";

export default class ResetService {

    private gameService: GameService;

    constructor(gameService: GameService) {
        this.gameService = gameService
    }

    public resetMembers(members: GuildMember[], soft: boolean = false) {
        if (soft) {
            members.forEach(member => this.resetMemberSoft(member))

            return
        }

        members.forEach(member => this.resetMember(member));

        this.gameService.resetJoins();
    }

    public resetMember(member: GuildMember) {
        this.gameService.leave(member)
            .then(() => console.log('member ' + member.user.username + ' leaves'))

        this.resetMemberSoft(member)
    }

    public resetMemberSoft(member: GuildMember) {
        let diedRole = member.guild.roles.cache.filter(role => role.name === 'mort').first()
        let mayorRole = member.guild.roles.cache.filter(role => role.name === 'maire').first()

        member.roles.remove(diedRole)
            .catch(console.error)

        member.roles.remove(mayorRole)
            .catch(console.error)

        // @todo déplacer les membres dans un autre salon
    }
}
