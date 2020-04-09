const Discord = require('discord.js')
const config = require('./config')
const ResetService = require('./src/Command/ResetService')
const CommandFactory = require('./src/Command/CommandFactory')
const Di = require('./src/Di')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)
const bot = new Discord.Client()
const di = new Di()

bot.on('message', function (message) {
    // garde fou permettant d'éviter le chargement de dépendances uniquement pour chaque message recu
    if (message.content.startsWith('wog ')) {
        let gameGuild = db.get('guilds').find({id: message.guild.id}).value()
        if (!gameGuild) {
            db.get('guilds').push({id: message.guild.id}).write()
        }

        CommandFactory.handle(message, di)
    }
})

bot.on('presenceUpdate', function (oldMember, newMember) {

    if (newMember.presence.status === 'offline') {
        di.get(ResetService.name).resetMember(newMember)
    }
})

db.defaults({guilds: []}).write()

bot.login(config.botToken)
