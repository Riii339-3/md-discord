require("dotenv").config();
const { Client, GatewayIntentBits } = require('discord.js');

const fs = require('fs');

const debug = true

if (!process.env.DISCORD_TOKEN) {
    debug && console.log(`Not found Discord Token`)
    return
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

debug && console.log(`${client}`)

client.on("ready", async () => {
    debug && console.log("readyed")
    const markdowns = JSON.parse(
        fs.readFileSync("markdowns.json", "utf-8")
    )
    if (debug) console.log(`readed markdowns.json: ${markdowns}`)
        
    const token = process.env.DISCORD_TOKEN
    for (let i = 0; i < markdowns.length; i++) {
        const data = markdowns[i]
        if (!data.isSetuped) {
            continue
        }

        const messageId = data.messageId
        const channelId = data.channelId
        const mdpath = data.path
        const mdfile = fs.readFileSync(mdpath, "utf-8")

        const channel = await client.channels.fetch(channelId)
        const message = await channel.messages.fetch(messageId)
        await message.edit({content: mdfile})

    }

    await client.destroy();
})

client.login(process.env.DISCORD_TOKEN);