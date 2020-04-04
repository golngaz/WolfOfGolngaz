const Player = require('./Player')

module.exports = class Seer extends Player {
    constructor(member) {
        super(member);
    }

    static key() {
        return 'seer'
    }

    label() {
        return 'Voyante'
    }
}