const Player = require('./Player')

module.exports = class Hunter extends Player {
    constructor(member) {
        super(member);
    }

    static key() {
        return 'hunter'
    }

    label() {
        return 'Chasseur'
    }
}