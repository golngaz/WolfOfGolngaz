const Player = require('./Player')
const Angel = require('./Angel')
const Beggars = require('./Beggars')
const Cupid = require('./Cupid')
const Fox = require('./Fox')
const Hunter = require('./Hunter')
const Saving = require('./Saving')
const Seer = require('./Seer')
const Shaman = require('./Shaman')
const SimpleVillager = require('./SimpleVillager')
const Werewolf = require('./Werewolf')
const Witch = require('./Witch')

module.exports = class PlayerFactory extends Player {

    /**
     * @return {object}
     */
    static mapping() {
        let mapping = {}

        mapping[Angel.key()] = Angel
        mapping[Beggars.key()] = Beggars
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