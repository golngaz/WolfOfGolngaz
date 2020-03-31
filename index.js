const Discord = require('discord.js');
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


bot.login('Njk0NDg4Nzg0MjkyNTQ0NTUy.XoNgrQ.o20vACHM11oa_M9x1cHY7Lblj70');
