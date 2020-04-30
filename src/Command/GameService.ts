import Shaman from '../Game/Shaman'
import Di from '../Di';
import {Guild} from 'discord.js';
import Lowdb, {LoDashExplicitSyncWrapper, LowdbSync} from "lowdb";

export default class GameService {
    private guild: Guild;
    private db: any;
    private guildDb: any;

    constructor(di: Di, guild: Guild) {
        this.guild = guild
        this.db = di.db
        this.guildDb = GameService.initDb(this.db, guild.id)
    }

    end() {
        let node = this.db.get('guilds').find({id: this.guild.id})

        node.value().game = {
            active: false,
            time: 'night',
            masterMemberId: '',
            players: [],
        }

        node.write()
    }

    initConfig() {
        let node = this.db.get('guilds').find({id: this.guild.id})

        node.value().game = {
            active: false,
            time: 'night',
            masterMemberId: '',
            players: [],
        }

        node.value().config = {
            roles: ['werewolf', 'werewolf', 'seer']
        }

        node.write()
    }

    static initDb(db: any, guildId: string): LoDashExplicitSyncWrapper<any> {
        let node = db.get('guilds').find({id: guildId})

        if (node.value()) {
            return node
        }

        console.log('création de la guilde id : ' + guildId)

        let defaultGuildDb = {
            id: guildId,
            game: {
                active: false,
                time: 'night',
                masterMemberId: '',
                players: [],
            },
            config: {
                roles: ['werewolf', 'werewolf', 'seer']
            }
        }

        db.get('guilds').push(defaultGuildDb).write()

        return db.get('guilds').find({id: guildId})
    }

    /**
     * Est-ce qu'une partie est en cours
     */
    isRunning() {
        return this.guildDb.get('game').value() && this.guildDb.get('game').value().active === true
    }

    isDay() {
        return this.guildDb.get('game').value().time === 'day'
    }

    isNight() {
        return this.guildDb.get('game').value().time === 'night'
    }

    handleMessage(message) {
        if (message.channel.name !== 'cimetière' || this.isDay()) {
            return
        }

        // @todo parcourir les joueurs et exécuter le code contenu dans les classe du rôle
        let shaman = this.guildDb.get('game').value().players.filter(player => player.roleKey === Shaman.key())[0]
        if (shaman) {
            let memberShaman = message.guild.members.cache
                .filter(member => member.id === shaman.memberId)
                .filter(member => member.roles.cache.some(role => role.name === 'jeu'))
                .filter(member => !member.roles.cache.some(role => role.name === 'mort'))
                .first()

            if (memberShaman) {
                return memberShaman
                    .send('Mort : "*' + message.content + '*"')
            }
        }
    }
}
