const Discord = require('discord.js');

var bot = new Discord.Client();

bot.on('message', function (message) {
    if (message.content === 'wog ping') {
        message.reply('pong');
    }
})


bot.login('Njk0NDg4Nzg0MjkyNTQ0NTUy.XoMiDQ.ExMarytGzz0R2F8YQDNJ_NsbkEI');
