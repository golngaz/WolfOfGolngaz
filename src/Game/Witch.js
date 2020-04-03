const Player = require('./Player')

module.exports = class Witch extends Player {
    constructor(member) {
        super(member);
    }

    static key() {
        return 'witch'
    }

    label() {
        return 'Sorcière'
    }
}