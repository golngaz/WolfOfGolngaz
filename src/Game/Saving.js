const Player = require('./Player')

module.exports = class Saving extends Player {
    constructor(member) {
        super(member);
    }

    static key() {
        return 'saving'
    }

    label() {
        return 'Salvateur'
    }
}