const Discord = require('discord.js')
const config = require('./config')
const ResetService = require('./src/Command/ResetService')
const CommandFactory = require('./src/Command/CommandFactory')
const Shaman = require('./src/Game/Shaman')
const GameService = require('./src/Command/GameService')
const Di = require('./src/Di')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)
const bot = new Discord.Client()
const di = new Di(db)

bot.on('message', function (message) {
    if (!message.guild) {
        return
    }

    di.setGuild(message.guild)

    let gameService = di.get(GameService.name, message.guild)

    // garde fou permettant d'éviter le chargement de dépendances uniquement pour chaque message recu
    if (message.content.startsWith('wog ')) {
        CommandFactory.handle(message, di)
    } else if (gameService.isRunning()) {
        return gameService.handleMessage(message)
    }
})

// @todo rajouter une condition vérifiant qu'aucune game n'est en cours
// bot.on('presenceUpdate', function (oldMember, newMember) {
//
//     if (newMember.presence.status === 'offline') {
//         di.get(ResetService.name).resetMember(newMember)
//     }
// })

db.defaults({guilds: []}).write()

bot.login(config.botToken)
