const Player = require('./Player')

module.exports = class Angel extends Player {
    constructor(member) {
        super(member);
    }

    static key() {
        return 'angel'
    }

    label() {
        return 'l\'Ange'
    }
}