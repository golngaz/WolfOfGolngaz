const Player = require('./Player')

module.exports = class Werewolf extends Player {
    constructor(member) {
        super(member);
    }

    static key() {
        return 'werewolf'
    }

    label() {
        return 'Loup-Garou'
    }
}