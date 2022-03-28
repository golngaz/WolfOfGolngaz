import Di from "../Di";
import {
    APIMessageContentResolvable,
    Guild,
    GuildMember,
    Message,
    MessageAdditions,
    MessageEmbed,
    TextChannel
} from "discord.js";
import GameService from "../Command/GameService";

export default class PollService {
    private db: any;
    private guild: Guild;

    constructor(di: Di, guild: Guild) {
        this.guild = guild
        this.db = di.db

        PollService.initDb(this.db, this.guild.id);
    }

    public static initDb(db, guildId: string) {
        let node = GameService.initDb(db, guildId) as any;

        if (node.polls === undefined) {
            node.polls = []
        }

        node.write();
    }

    /**
     * Will create and send
     */
    public create(body: APIMessageContentResolvable|MessageAdditions, suggestionList: Array<string> = []): (destination: TextChannel|GuildMember) => Promise<Message> {

        return (destination: TextChannel) => {
            return destination.send(body)
                // .then((message: Message) => {
                //     suggestionList.forEach(suggestion => {
                //         await message.addReaction('machin')
                //     })
            // });
        }
    }

    public test() {
        // @see https://discord.com/developers/docs/resources/channel#embed-object

    }
}
