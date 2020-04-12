const Player = require('./Player')

module.exports = class Shaman extends Player {
    constructor(member) {
        super(member);
    }

    static key() {
        return 'shaman'
    }

    label() {
        return 'Chaman'
    }
}