const Discord = require('discord.js');

var bot = new Discord.Client();

bot.on('message', function (message) {
    if (message.content === 'wog ping') {
        message.reply('pong');
        message.author.send('coucou mon petit');
    }
})


bot.login('Njk0NDg4Nzg0MjkyNTQ0NTUy.XoMvJA.NxlHywXdHGNeiB4CyGjQI9nn8mE');
