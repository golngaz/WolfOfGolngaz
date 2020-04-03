const Player = require('./Player')

module.exports = class SimpleVillager extends Player {
    constructor(member) {
        super(member);
    }

    static key() {
        return 'simple-villager'
    }

    label() {
        return 'Simple Villageois'
    }
}