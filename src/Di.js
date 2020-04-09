const ResetService = require('./Command/ResetService')

module.exports = class Di {
    constructor(db) {
        this.db = db
        this.services = []

        this.initServices()
    }

    initServices() {
        this.services[ResetService.name] = (guild) => new ResetService(guild)
    }

    get(serviceId, ...args) {
        if (!this.services[serviceId]) {
            throw Error('Service doesn\'t found')
        }

        return this.services[serviceId](...args)
    }
}
