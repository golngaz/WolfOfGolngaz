const Player = require('./Player')

module.exports = class Beggars extends Player {
    constructor(member) {
        super(member);
    }

    static key() {
        return 'beggars'
    }

    label() {
        return 'Gueux'
    }
}
