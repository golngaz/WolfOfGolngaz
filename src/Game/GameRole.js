module.exports = class GameRole {
    constructor(member) {
        this.member = member
    }

    /**
     * @param {GameRole} gameRole
     */
    is(gameRole) {
        return gameRole.key() === this.key()
    }

    static key() {
        throw 'To implement'
    }

    static label() {
        throw 'To implement'
    }

    static format() {
        return '*' + this.label() + '*'
    }
}