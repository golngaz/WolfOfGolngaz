import {AdapterSync, LowdbSync} from 'lowdb';
import ResetService from './Command/ResetService.js'
import GameService from './Command/GameService.js'
import ConfigRoleService from './Command/Config/ConfigRoleService.js'
import { Guild } from 'discord.js';
import FileSync from "lowdb/adapters/FileSync";

interface Constructor<T> {
    new (...args: any[]): T
    name: string;
}

class Di {
    // @todo set private
    public readonly db: any;
    private readonly services: object;
    private guild: Guild|null;

    constructor(db: any) {
        this.db = db
        this.services = []
        this.guild = null

        this.initServices()
    }

    setGuild(guild: Guild): void {
        this.guild = guild
    }

    getGuild(): Guild|null {
        return this.guild
    }

    initServices(): void {
        this.set(ResetService, (di: Di) => new ResetService(new GameService(di, this.guild)));
        this.set(GameService, (di: Di) => new GameService(di, this.guild));
        this.set(ConfigRoleService, (di: Di) => new ConfigRoleService(di, this.guild));
    }

    set<T>(service: Constructor<T>, factory: (di: Di, ...args: any[]) => T): void {
        this.services[service.name] = factory;
    }

    get<T>(service: Constructor<T>, ...args: any[]): T {
        if (!this.services[service.name]) {
            throw Error('Service ' + service.name +' is not found');
        }

        return this.services[service.name](this, ...args)
    }
}

export = Di;
