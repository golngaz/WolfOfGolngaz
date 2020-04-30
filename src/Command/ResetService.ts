import {GuildMember} from "discord.js";

export default class ResetService {
    resetMembers(members: GuildMember[], soft = false) {
        if (soft) {
            members.forEach(member => this.resetMemberSoft(member))
            return
        }

        members.forEach(member => this.resetMember(member))
    }

    resetMember(member) {
        let gameRole = member.guild.roles.cache.filter(role => role.name === 'jeu').first()

        member.removeRole(gameRole)
            .catch(console.error)

        this.resetMemberSoft(member)
    }

    resetMemberSoft(member: GuildMember) {
        let diedRole = member.guild.roles.cache.filter(role => role.name === 'mort').first()
        let mayorRole = member.guild.roles.cache.filter(role => role.name === 'maire').first()

        member.roles.remove(diedRole)
            .catch(console.error)

        member.roles.remove(mayorRole)
            .catch(console.error)

        // @todo déplacer les membres dans un autre salon
    }
}
