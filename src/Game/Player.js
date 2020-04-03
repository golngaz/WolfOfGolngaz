/**
 * Un joueur est un membre composé d'un role
 */
module.exports = class Player {
    /**
     * @param {GuildMember} member
     */
    constructor(member) {
        this.member = member
    }

    /**
     * @param {string} classKey
     */
    is(classKey) {
        return this.constructor.key() === classKey
    }

    /**
     * @return {string}
     */
    static key() {
        throw new Error('To implement')
    }

    /**
     * @return {string}
     */
    label() {
        throw new Error('To implement')
    }

    /**
     * @param {Player} player
     *
     * @return {Player}
     */
    static fromPlayer(player) {
        return new this(player.member)
    }

    /**
     * @return {string}
     */
    static format() {
        return '*' + this.label() + '*'
    }

    /**
     * @param {string=} message
     * @param {object=} options
     */
    send(message, options) {
        this.member.send(message, options)
    }
}