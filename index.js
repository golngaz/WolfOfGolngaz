const Discord = require('discord.js')
const config = require('./config')
const CommandFactory = require('./src/CommandFactory')

var bot = new Discord.Client()

bot.on('message', function (message) {
    CommandFactory.handle(message)
})


bot.login(config.botToken)
