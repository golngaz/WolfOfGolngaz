const ResetService = require('./Command/ResetService')
const GameService = require('./Command/GameService')
const ConfigRoleService = require('./Command/Config/ConfigRoleService')

module.exports = class Di {
    constructor(db) {
        this.db = db
        this.services = []
        this.guild = null

        this.initServices()
    }

    setGuild(guild) {
        this.guild = guild
    }

    initServices() {
        this.services[ResetService.name] = () => new ResetService()
        this.services[GameService.name] = (di) => new GameService(di, this.guild)
        this.services[ConfigRoleService.name] = (di) => new ConfigRoleService(di, this.guild)
    }

    get(serviceId, ...args) {
        if (!this.services[serviceId]) {
            throw Error('Service doesn\'t found')
        }

        return this.services[serviceId](this, ...args)
    }
}
