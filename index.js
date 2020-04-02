const Discord = require('discord.js')
const config = require('./config')
const CommandFactory = require('./src/CommandFactory')

var bot = new Discord.Client()

bot.on('message', function (message) {
    CommandFactory.handle(message)
         .then(() => {
            message.author.send('Jeu initialisé ;)')
         })
         .catch((error) => {
             message.author.send('Erreur lors de l\'initialisation du jeu')

             console.error(error)
         })
})


bot.login(config.botToken)
