/*
このコードはもう使われていません
This code is no longer in use

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
        if (data.isSetuped) {
            continue
        }
        const channelId = data.channelId
        const mdpath = data.path
        const mdfile = fs.readFileSync(mdpath, "utf-8")

        const channel = await client.channels.fetch(channelId)
        const message = await channel.send({content: mdfile})
        const messageId = message.id

        data.messageId = messageId
        data.isSetuped = true

    }
    fs.writeFileSync(
        "./markdowns.json",
        JSON.stringify(markdowns, null, 2),
        "utf-8"
    )
    debug && console.log("file writed")

    await client.destroy();
})

client.login(process.env.DISCORD_TOKEN);
*/