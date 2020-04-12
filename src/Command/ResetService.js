module.exports = class ResetService {
    resetMembers(members, soft = false) {
        if (soft) {
            members.forEach(member => this.resetMemberSoft(member))
            return
        }

        members.forEach(member => this.resetMember(member))
    }

    resetMember(member) {
        let gameRole = member.guild.roles.filter(role => role.name === 'jeu').first()

        member.removeRole(gameRole)
            .catch(console.error)

        this.resetMemberSoft(member)
    }

    resetMemberSoft(member) {
        let diedRole = member.guild.roles.filter(role => role.name === 'mort').first()
        let mayorRole = member.guild.roles.filter(role => role.name === 'maire').first()

        member.removeRole(diedRole)
            .catch(console.error)

        member.removeRole(mayorRole)
            .catch(console.error)

        // @todo déplacer les membres dans un autre salon
    }
}
