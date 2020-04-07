const Discord = require('discord.js')
const config = require('./config')
const CommandFactory = require('./src/CommandFactory')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)
const bot = new Discord.Client()

bot.on('message', function (message) {
    // garde fou permettant d'éviter le chargemlent de dépendances unitelement pour chaque message recu
    if (message.content.startsWith('wog ')) {
        CommandFactory.handle(message)
    }
})



db.defaults({starts: 0, ok: 'pas ok'})

console.log(db.get('starts').value())

db.update('starts', n => n + 1)
    .write()


//bot.login(config.botToken)
