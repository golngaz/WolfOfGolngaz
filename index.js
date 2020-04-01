const Discord = require('discord.js');
const config = require('./config')
const CommandFactory = require('./src/CommandFactory');

var bot = new Discord.Client();

bot.on('message', function (message) {
    CommandFactory.handle(message)
        // .then(() => {
        //
        // })
        // .catch(() => {
        //     message.reply('Commande inconnue !')
        // })


    // if (message.content === 'wog ping') {
    //     message.reply('pong');
    //     message.author.send('coucou mon petit');
    // }
    //
    if (message.content === 'wog debug') {

    }
})


bot.login(config.botToken);
