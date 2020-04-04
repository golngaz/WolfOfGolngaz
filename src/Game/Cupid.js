const Player = require('./Player')

module.exports = class Cupid extends Player {
    constructor(member) {
        super(member);
    }

    static key() {
        return 'cupid'
    }

    label() {
        return 'Cupidon'
    }
}