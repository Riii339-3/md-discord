require("dotenv").config();
const { Client, GatewayIntentBits } = require('discord.js');

const fs = require('fs');

const debug = false

if (!process.env.DISCORD_TOKEN) {
    debugMessage(`Not found Discord Token`)
    return
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

debugMessage(`${client}`)

client.on("ready", async () => {
    debugMessage("ready")
    if (!fs.existsSync("config/markdowns.json")) {
        throw new Error("markdowns.json is not found")
    }
    const markdowns = JSON.parse(
        fs.readFileSync("config/markdowns.json", "utf-8")
    )

    if (!fs.existsSync(".state")) fs.mkdirSync(".state", { recursive: true })
    if (!fs.existsSync(".state/data.json")) fs.writeFileSync(".state/data.json", "[]")
    
    const jsondata = JSON.parse(
        fs.readFileSync(".state/data.json", "utf-8")
    )

    for (let i = 0; i < markdowns.length; i++) {
        const data = markdowns[i]

        const channelId = data.channelId
        const mdpath = data.path
        if (!channelId || !mdpath) {
            throw new Error("channelId or path not found")
        }

        const mdfile = fs.readFileSync(`./markdowns/${mdpath}`, "utf-8")

        if (!jsondata[i]?.isSended) {
            const channel = await client.channels.fetch(channelId)
            const message = await channel.send({content: mdfile})

            jsondata[i] = {}
            jsondata[i].isSended = true
            jsondata[i].messageId = message.id
        }
        else {
            const messageId = jsondata[i].messageId

            const channel = await client.channels.fetch(channelId)
            const message = await channel.messages.fetch(messageId)
            await message.edit({content: mdfile})
        }
    }
    
    fs.writeFileSync(
        ".state/data.json",
        JSON.stringify(jsondata, null, 2),
        "utf-8"
    )

    await client.destroy();
})

client.login(process.env.DISCORD_TOKEN);

function debugMessage(message) {
    debug && console.log(message)
}