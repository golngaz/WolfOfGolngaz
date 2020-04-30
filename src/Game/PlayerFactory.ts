import Player from './Player'
import Angel from './Angel'
import Cupid from './Cupid'
import Fox from './Fox'
import Hunter from './Hunter'
import Saving from './Saving'
import Seer from './Seer'
import Shaman from './Shaman'
import SimpleVillager from './SimpleVillager'
import Werewolf from './Werewolf'
import Witch from './Witch'

export default class PlayerFactory extends Player {

    /**
     * @return {object}
     */
    static mapping() {
        let mapping = {}

        mapping[Angel.key()] = Angel
        mapping[Cupid.key()] = Cupid
        mapping[Fox.key()] = Fox
        mapping[Hunter.key()] = Hunter
        mapping[Saving.key()] = Saving
        mapping[Seer.key()] = Seer
        mapping[Shaman.key()] = Shaman
        mapping[SimpleVillager.key()] = SimpleVillager
        mapping[Werewolf.key()] = Werewolf
        mapping[Witch.key()] = Witch

        return mapping
    }

    /**
     * @param {string} roleKey
     * @param {GuildMember=} member
     */
    static get(roleKey, member) {
        let roleClass = this.mapping()[roleKey]
        if (roleClass) {
            return new roleClass(member)
        }

        return null
    }
}