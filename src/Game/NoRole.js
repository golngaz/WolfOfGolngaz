const Player = require('./Player')

module.exports = class NoRole extends Player {
    constructor(member) {
        super(member);
    }

    static key() {
        return 'no-role'
    }

    label() {
        return 'Sans Rôle'
    }
}