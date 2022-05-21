if (process.env.NODE_ENV !== "prod") require("dotenv").config()
const { Client, Intents, MessageEmbed } = require("discord.js")
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})
const db = require("./db")

const gen = [
  "...",
  "...",
  "Què volsss?",
  "...",
  "QUÈ!?",
  "[gen noises]",
  "Pro què volsssss?",
  "estupid del mon contemporani...",
  "...",
  "...",
  "...",
  "Bueno què!?",
  "Putu imbècil",
  "que ets estúpit",
  "espuuupit",
  "...",
  "...",
  "...",
  "...",
  "...",
  "ai estava empanat",
  "...",
  ".....",
  "Bueno ja prou no? Ja està. Prou, he hagut d'intervenir jo, el creador d'aquest bot i súbdit leal del gran Gen, aka Surak. Has arribat al final d'aquest array de respostes, només s'aconsegueix arribar aquí fent el que tu has fet. Molt be noi, has trobat l'únic (?:eyes:?) easter egg d'aquest bot, vols un premi? Subnormal.",
  "................",
  "FUCKING SHIT",
  "....",
]

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("debug", console.log)

let lastNQuotes = []

let genCounter = 0

let latestQuotesMap = {}

const buildQuoteList = (quotes) => {
  latestQuotesMap = {}
  let parts = []
  console.log(quotes)
  let acc = "```"
  quotes.forEach((quote, i) => {
    const new_ = `\n${i + 1}: "${quote.text}"`
    latestQuotesMap[i + 1] = quote._id
    if (acc.length + new_.length >= 1996) {
      acc += "```"
      parts.push(acc)
      acc = "```" + new_
    } else {
      acc += new_
    }
  })
  acc += "```"
  return [...parts, acc]
}

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return
  console.log("Received message:", msg.content)

  const msgContent = msg.content.toLowerCase()

  if (msgContent === "gen quote") {
    const quote = await db.getRandomQuote(lastNQuotes)
    if (!quote?.length) return
    lastNQuotes.push(quote[0]._id)
    if (lastNQuotes.length > process.env.QUOTE_REPEAT_THRESHOLD)
      lastNQuotes.shift()
    msg.channel.send(quote ? quote[0].text : "No quotes found")
    genCounter = 0
  } else if (msgContent === "gen") {
    if (genCounter >= gen.length) genCounter = 0
    msg.channel.send(gen[genCounter])
    genCounter += 1
  } else if (msgContent.startsWith("gen add quote")) {
    await db.addQuote(msg.content.split("gen add quote ")[1])
    console.log(msg)
    msg.react("✅")
    msg.delete(3000)
    genCounter = 0
  } else if (
    msgContent.startsWith("gen del quote") ||
    msgContent.startsWith("gen delete quote")
  ) {
    const quoteNum = msg.content.split("gen del quote ")[1]
    const quoteID = latestQuotesMap[quoteNum]
    if (quoteID) {
      await db.deleteQuoteByID(quoteID)
      msg.react("🗑️")
    } else {
      msg.channel.send("No la trobo sucnormal")
    }
    genCounter = 0
  } else if (
    msgContent.startsWith("gen list quote") ||
    msgContent.startsWith("gen list quotes")
  ) {
    const quotes = await db.getAllQuotes()
    const listParts = buildQuoteList(quotes)
    listParts.forEach((part) => msg.channel.send(part))
    genCounter = 0
  } else if (msgContent.startsWith("gen help")) {
    msg.reply(`Valla estupit! Que vols ara!? Ah, els comandos, valla subnormal...
\`\`\`gen quote          - una quote classica d'en gen
gen add quote      - per si ets prou intelligent per afegir una quote a la llista
gen delete quote n - per si vols treure una quote que ha posat un imbècil (n es el número de la quote)
gen list quote     - la llista dels quotes d'en gen \`\`\``)
    genCounter = 0
  } else if (msgContent.startsWith("gen porn")) {
    const genEmbed = new MessageEmbed()
      .setColor("#FFC0CB")
      // .setTitle('Hey sexy... 😘')
      .setImage(
        "https://media.discordapp.net/attachments/522167253639102494/953378153810767952/memejan.jpg"
      )

    msg.channel.send({ embeds: [genEmbed] })
  } else if (
    msgContent.startsWith("gen hola") ||
    msgContent.startsWith("gen hello")
  ) {
    const genEmbed = new MessageEmbed()
      .setColor("#ffffff")
      .setTitle("Eii")
      .setImage(
        "https://media.discordapp.net/attachments/427459241415147532/974783101588897852/gen.gif"
      )
    msg.channel.send({ embeds: [genEmbed] })
  } else if (msgContent.startsWith("gen ping")) {
    msg.channel.send("pong, bitch")
  }
})

client.login(process.env.DISCORD_TOKEN).catch(console.error)
