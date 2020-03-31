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
    // if (message.content === 'wog debug') {
    //     let wolfChannel = message.channel.guild.channels
    //         .filter(function(channel) {
    //             return channel.name === 'loup-garous' && channel.type === 'text'
    //         })
    //         .first()
    //
    //     if (wolfChannel) {
    //         message.reply('j ai trouvé le salon de loups : ' + wolfChannel.name + ', golngaz à les roles ' + wolfChannel.permissionsFor(message.author).serialize())
    //
    //         console.log(Command.test())
    //         return
    //     }
    //
    //     return message.reply('je n ai pas trouvé le salon')
    // }
})


bot.login('Njk0NDg4Nzg0MjkyNTQ0NTUy.XoNgrQ.o20vACHM11oa_M9x1cHY7Lblj70');
