import PlayerFactory from "../../Game/PlayerFactory";
import Di from "../../Di";
import {Guild, Message} from "discord.js";

export default class ConfigRoleService {
    private di: Di;
    private guild: Guild;
    private configDb: any;

    constructor(di: Di, guild: Guild) {
        this.di = di
        this.guild = guild

        this.configDb = di.db.get('guilds').find({id: guild.id}).get('config')
    }

    handle(message: Message, args: string[]) {
        if (args.length < 2 || (args[0] !== 'add' && args[0] !== 'remove' && args[0] !== 'set')) {
            return message.reply('Erreur arguments commande config de rôle avec : ' + args.join(', '));
        }

        if (!ConfigRoleService.roleOk(args[1])) {
            return message.reply('Le rôle n\'existe pas');
        }

        return this[args[0]](message, args[1], args[2]);
    }

    private static roleOk(roleKey): boolean {
        return !!PlayerFactory.mapping()[roleKey]
    }

    set(message, roleKey, nb): Promise<any> {
        this.removeOnDb(roleKey);

        let value = this.configDb.get('roles').value();
        for (let i = 0 ; i < nb ; i++) {
            value.push(roleKey);
        }

        this.configDb.get('roles').write();

        return message.reply('Le nombre de ' + roleKey + ' est passé à ' + nb);
    }

    add(message: Message, roleKey: string) {
        let roles = this.configDb.get('roles');

        if (roles.value().indexOf(roleKey) !== -1) {
            return message.reply('rôle **' + roleKey + '** déjà présent');
        }

        this.configDb.get('roles').value().push(roleKey);

        this.configDb.get('roles').write();

        return message.reply('rôle **' + roleKey + '** ajouté');
    }

    remove(message: Message, roleKey: string) {
        let roles = this.configDb.get('roles');

        if (roles.value().indexOf(roleKey) === -1) {
            return message.reply('rôle **' + roleKey + '** non présent');
        }

        this.removeOnDb(roleKey)

        return message.reply('rôle **' + roleKey + '** supprimé');
    }

    private removeOnDb(roleKey: string) {
        if (this.configDb.get('roles').indexOf(roleKey) === -1) {
            return;
        }

        let value = this.configDb.get('roles').value();

        while (value.indexOf(roleKey) !== -1) {
            value.splice(value.indexOf(roleKey), 1);
        }

        this.configDb.get('roles').set(value).write();
    }
}
