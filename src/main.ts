import Discord from 'discord.js';
import config from '../config.json'
import CommandFactory from './Command/CommandFactory';
import GameService from './Command/GameService';
import Di from './Di';
import FileSync from 'lowdb/adapters/FileSync';
import Lowdb from "lowdb";
import ResetService from "./Command/ResetService";

const db = Lowdb(new FileSync('db.json'))
const bot = new Discord.Client()
const di = new Di(db)

bot.on('ready', function () {
    console.info('Je suis ready')
})

bot.on('message', function (message) {
    if (!message.guild || !message.content) {
        return;
    }

    di.setGuild(message.guild)

    let gameService = di.get(GameService, message.guild)

    // garde fou permettant d'éviter le chargement de dépendances uniquement pour chaque message recu
    if (message.content.startsWith('wog ') || message.content === 'wog') {
        CommandFactory.handle(message, di)
    } else if (gameService.isRunning()) {
        return gameService.handleMessage(message)
    }
})

// @todo ne fonctionne pas...
// bot.on('presenceUpdate', function (oldPresence, presence) {
//     if (oldPresence.status !== 'offline' && presence.status === 'offline' && presence.member) {
//
//         di.setGuild(presence.member.guild);
//
//         if (!di.get(GameService).isRunning()) {
//             di.get(ResetService).resetMember(presence.member)
//         }
//     }
// })

db.defaults({guilds: []}).write()

bot.login(config.botToken)
