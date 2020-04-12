const ResetService = require('./Command/ResetService')
const GameService = require('./Command/GameService')

module.exports = class Di {
    constructor(db) {
        this.db = db
        this.services = []

        this.initServices()
    }

    initServices() {
        this.services[ResetService.name] = (di, guild) => new ResetService()
        this.services[GameService.name] = (di, guild) => new GameService(di, guild)
    }

    get(serviceId, ...args) {
        if (!this.services[serviceId]) {
            throw Error('Service doesn\'t found')
        }

        return this.services[serviceId](this, ...args)
    }
}
