const Player = require('./Player')

module.exports = class Fox extends Player {
    constructor(member) {
        super(member);
    }

    static key() {
        return 'fox'
    }

    label() {
        return 'Renard'
    }
}
