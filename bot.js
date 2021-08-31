var colors = require('colors/safe')
const classes = require('./classes.js')
const Axolotl = classes.Axolotl
var emoji = require('node-emoji')
const AxolotlEmbed = classes.AxolotlEmbed
const console = require('./console.js')
var print = console.log
const Database = require("@replit/database")
const log = console.log
const logData = console.logData
const logErr = console.logErr
const logNote = console.logNote
const logColor = console.logColor
const Discord = require('discord.js')
require('discord-reply')
const client = new Discord.Client()
const { Client, MessageEmbed } = require('discord.js')
const { parser, htmlOutput, toHTML } = require('discord-markdown')
const readline = require('readline')
const FileType = require('file-type')
const ConsoleProgressBar = require('console-progress-bar')
var EventEmitter = require('events')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const title = '``starting...``'
const defaultChannel = '717086427581775896'
var setChannel
var botChl
var botMsg
var lastMsg
var logMessages = true
var messages = []
var other_messages = []
var msgids
var nicknames = new Map()
var usernames = new Map()
const db = new Database()
var request = require('request').defaults({ encoding: null })
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server)
var discord_inited = false
var console_cache_arr = []

colors.setTheme({
  logMessage: ['brightBlue', 'italic']
})

/// Functions

const Jimp = require('jimp')

function console_cache(stuff) {
	console_cache_arr.push(stuff)
}

async function main() {
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  const image = await Jimp.read(1000, 1000, 0x0000ffff);

  image.print(font, 10, 10, 'Hello World!');
}

main()

function send(msg) {
  botChl.send(String(msg))
}

function small_send(msg) {
	setChannel.send(emoji.emojify(String(msg)))
}

function sendError(type) {
  switch(type) {
    case'syntax':
      send('\`\`Invalid syntax\`\`')
    break
    default:
      send('\`\`error\`\`')
    break
  }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var init = new EventEmitter()

function get_channels() {
	let to_send = []
	let channels = client.channels.cache.array()
	channels.forEach(i => {
		to_send.push({
			name: i.name,
			id: i.id,
		})
	})
	
	return JSON.stringify(to_send)
}

function get_servers() {
	let responed = false
	return new Promise((res, rej) => {
		setTimeout(() => {
			if (!responed) {
				responed = true
				res([0, "-{ SYSTEM }-", `error, you dumb whore...`, "https://i.imgur.com/zC3bS7w.png", "#ffea63", null, "100"]);
			}
		}, 7000)
		let to_send = []
		let guilds_arr = client.guilds.cache.array()
		let guilds_iter = 0
		let guilds_total = guilds_arr.length
		guilds_arr.forEach(i => {
			let channels = []
			client.channels.cache.array().forEach(o => {
				if (o.guild.id == i.id && o.type == "text" && o.viewable && !o.nsfw ) {
					channels.push({
						name: o.name,
						id: o.id,
						pos: o.rawPosition
					})
				}
			})
			channels.sort(function(a, b) {
				return a.pos - b.pos;
			})
			
			request.get(i.iconURL(), function (error, response, body) {
				let gd_data = "https://i.imgur.com/Ni5sW88.png"
				if (!error && response.statusCode == 200) {
					gd_data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
				}
				to_send.push({
					name: i.name,
					icon: gd_data,
					id: i.id,
					channels: channels,
				})
				guilds_iter++
				if (guilds_iter == guilds_total) {
					to_send.sort((a, b) => a.name < b.name)
					res(JSON.stringify(to_send))
				}
			})
		})
	})
}

async function get_message_args(message) {
	let responed = false
	return new Promise((res, rej) => {
		setTimeout(() => {
			if (!responed) {
				print("ERROR: " + message.author.username + ": " + message.content)
				responed = true
				res([0, "-{ SYSTEM }-", `error, you dumb whore...`, "https://i.imgur.com/zC3bS7w.png", "#ffea63", null, "100"]);
			}
		}, 7000)
		let ma = message.attachments.array()
		let color = "#fff"
		let author_name = message.author.username
		if (message.member != null) {
			author_name = (message.member.nickname != "" ? message.author.username : message.member.nickname)
			color = message.member.displayHexColor
		}
		request.get(message.author.displayAvatarURL(), function (error, response, body) {
			if (!error && response.statusCode == 200) {
				let data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
				if (ma.length == 0) {
					responed = true
					res([message.createdAt.valueOf(), author_name, toHTML(emoji.emojify(message.content)), data, color, null, message.author.id, message.id])
				} else {
					let attachs = []
					let attach_total = ma.length
					let attach_iter = 0
					ma.forEach( attch_obj => {
						request.get(attch_obj.attachment, async function (at_error, at_response, at_body) {
							if (!at_error && at_response.statusCode == 200) {
								buffer = Buffer.from(at_body)
								let att_data = "data:" + at_response.headers["content-type"] + ";base64," + Buffer.from(at_body).toString('base64');
								FileType.fromBuffer(buffer).then( file_type => {
									if (file_type) {
										attachs[attach_iter] = [att_data, file_type.mime]
										attach_iter++
									} else {
										attach_total--
									}
									if (attach_iter == attach_total) {
										responed = true
										res([message.createdAt.valueOf(), author_name, toHTML(emoji.emojify(message.content)), data, color, JSON.stringify(attachs), message.author.id, message.id])
									}
								})
							} else {
								responed = true
								res([0, "-{ SYSTEM }-", `error, you dumb whore...\n${at_error}`, "https://i.imgur.com/zC3bS7w.png", "#ffea63", null, "100"]);
							}
						})
					})
				}
			} else {
				responed = true
				res([0, "-{ SYSTEM }-", `error, you dumb whore...\n${error}`, "https://i.imgur.com/zC3bS7w.png", "#ffea63", null, "100"]);
			}
		})
	})
}

io.on('connection', (socket) => {
	async function channel_init() {
		let msgs = []
		let iter_amount = 0
		let msg_collection = await setChannel.messages.fetch({ limit: 100 })
		const consoleProgressBar = new ConsoleProgressBar({ maxValue: msg_collection.size })
		msg_collection.each(index  => {
			get_message_args(index).then(async response => {
				if (response == null) {print("FUCK FUCK FUCK")}
				msgs.push(response)	
				iter_amount++
				consoleProgressBar.addValue(1)
				print = console_cache
				if (iter_amount == msg_collection.size) {
					msgs.sort((a, b) => a[0] - b[0])
					print("initializing...")
					let servers = await get_servers()
					socket.emit('init', msgs, servers)
					print = console.log
				}
			})
		})
	}
	if (discord_inited) {
		channel_init()
	}
  socket.on('chat message', (msg) => {
    small_send(msg)
  });
	socket.on('chat message attachment', (msg_arr) => {
		let buffer = Buffer.from(msg_arr[1])
		FileType.fromBuffer(buffer).then( file_type => {
			print(file_type)
			let attach = new Discord.MessageAttachment(buffer, `file.jpg`)
			setChannel.send(msg_arr[0], attach)
		})
	})
	socket.on('change_channel', (channel_id) => {
		client.channels.fetch(channel_id)
		.then(channel => {
			setChannel = channel
			setTimeout(function () {channel_init()}, 1000)
		})
  })
  socket.on('print', (stuff) => {
    print(stuff)
  });
	socket.on('typing', () => {
		let typing_channel = setChannel
		typing_channel.startTyping()
		setTimeout(function () {
			typing_channel.stopTyping()
		}, 1500)
	})
	socket.on('reply', (msg_id, content) => {
		setChannel.send(emoji.emojify(String(content)), {
			reply: msg_id
		})
	})
	client.on('message', msg => {
		if (msg.channel.id == setChannel) {
			get_message_args(msg).then(args => {
				socket.emit("chat message", args[1], args[2], args[3], args[4], args[5], args[6], args[7])
			})
		}
	})
	init.on('init', async (client) => {
		channel_init()
	})
});

/// Bot Commands

client.on('message', msg => {
	let msgArray = msg.content.split(" ")
	let ids = []
	let names = []
	let true_content = msg.content

	if (msg.author.username != client.user.username) {
		other_messages.push(msg)
	}

	msgArray.forEach(word => {
			let replace = /\d/g;
			if (word.match(replace) != null) {
				let id  = String((word.match(replace).join("")))
				let idee = setChannel.guild.members.cache.find(member => member.user.id === id)
				if (idee) {
					ids.push(id)
					names.push(idee.user.username)
				}
			}
	})
	let i = 0
	ids.forEach(id => {
		true_content = true_content.replace(id,`[${names[i]}]`)
		i = i+1
	})
  if (logMessages === true) {
    let ma = msg.attachments.array()
		if (msg.author.username == client.user.username) {
			console.log((colors.blue(`{${messages.length}} [${msg.guild.name}:${msg.channel.name}] ${msg.author.username}`)) + (colors.logMessage(`: ${true_content}`)))
		} else if (!msg.author.bot) {
			console.log((colors.brightBlue(`{${other_messages.length-1}} [${msg.guild.name}:${msg.channel.name}] ${msg.author.username}`)) + (colors.logMessage(`: ${true_content}`)))
		}
    if (ma.length > 0) {
      ma.forEach((value, index, array) => {
        logColor(value.url, 'brightBlue')
      })
  }
    lastMsg = msg
  }
  botMsg = msg
  botChl = msg.channel

  if (msg.content.startsWith('.ax ')) {
    botCmd(msg.content.replace('.ax ', ''), msg)
  }
})

const botCmds = new Map

    botCmds.set('help', {desc: 'Displays this embed', args: ['none']})
    botCmds.set('test', {desc: 'A command for testing', args: ['none']})
    botCmds.set('new', {desc: 'Nothing at the moment', args: ['name', 'color']})

function botCmd(input, raw) {
  const args = String(input).split(" ")
  const argCount = Number(args.length)-1
  const cmd = String(args[0]).toLowerCase()
  args.splice(0, 1)
  logNote(`${raw.author.username} used "${cmd}" command${(argCount === 0) ? "" : ` with ${argCount} arguments`}`)
  function checkArgs(count) {
    if (argCount !== count) {
      sendError('syntax')
      return false
    } else {
      return true
    }
}
  switch(cmd) {

    case'help':
      let capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
      }
      let a = []
      botCmds.forEach((value, key, map)=> {
      a.push(`**${capitalize(key)}**: ${value.desc}. *(arguments: ${value.args.join(", ")})*`)
      })
      botChl.send(new MessageEmbed()
            .setAuthor(`≽(• _ •)≼ AxolotlBot's Commands ≽(• _ •)≼`)
            .setTitle(`**Syntax:** *.ax [command] <arguments>*`)
            .setDescription(a.join("\n"))
            .setColor(`#024ACA`)
            .setFooter('Bot developed by: BluAxolotl'))
    break

    case'test':
      send('✅Test successful!')
      logColor('Test successful', ['green'])
    break
 my 
    case'new':
      if (checkArgs(2)) {
        let ax = new Axolotl(args[0], 0, args[1], 1, 'nothing')
        let axe = new AxolotlEmbed(ax.name, ax.age, ax.color, ax.size, ax.ability)
        botChl.send(axe.embed)
        logData(ax)
      }
    break
    
    default:
      send('Unknown command.')
    break
  }
}

/// console
rl.on('line', async (input) => {
	const args = input.split(" ")
  switch (input.split(" ")[0]) {
    case 'set':
     client.channels.fetch(input.split(" ")[1])
      .then(channel => {
        setChannel = channel
        console.log(`Set active channel to ${setChannel.id}`)
      })
    break
    case 'react':
      lastMsg.react(input.split(" ")[1])
    break
    case 'randReact':
      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
      }
      let emojis = lastMsg.guild.emojis.cache.array()
      if (emojis.length == 0) {
        logErr('No emotes on this server :L')
      } else {
        let num = getRandomInt(0, emojis.length-1)
        console.log(colors.brightBlue.italic(`${emojis[num].name}#${num}`))
        lastMsg.react(emojis[num].identifier)
      }
    break
    case 'ping':
		let mentionee
			if (usernames.has(String(input.replace("ping ", "")))) {
				mentionee = setChannel.guild.members.cache.find(member => member.user.tag === usernames.get(String(input.replace("ping ", ""))))
			} else {
				mentionee = setChannel.guild.members.cache.find(member => member.user.tag === String(input.replace("ping ", "")))
			}
			if (mentionee) {
				let m = await setChannel.send(`<@${mentionee.id}>`)
				messages.push(m)
			} else {
				logErr('Not an actual person >:|')
			}
    break
    case 'pingDisc':
      let pingee = setChannel.guild.members.cache.find(member => member.user.discriminator === String(input.replace("pingDisc ", "")))
      if (pingee) {
        let m = await setChannel.send(`<@${pingee.id}>`)
				messages.push(m)
      } else {
        logErr('Not an actual person\'s discriminator >:|')
      }
    break
    case 'list':
      setChannel.guild.members.cache
      .each(member => {
				let usertage = member.user.username
				if (nicknames.has(usertage + '#' + member.user.discriminator)) {
					if (member.presence.status == "online") {
						logColor((usertage + '#' + member.user.discriminator + ` [${nicknames.get(usertage + '#' + member.user.discriminator)}]`), "green")
					} else if (member.presence.status == "dnd") {
						logColor((usertage + '#' + member.user.discriminator + ` [${nicknames.get(usertage + '#' + member.user.discriminator)}]`), "red")
					} else if (member.presence.status == "idle") {
						logColor((usertage + '#' + member.user.discriminator + ` [${nicknames.get(usertage + '#' + member.user.discriminator)}]`), "yellow")
					} else if (member.presence.status == "offline") {
						logColor((usertage + '#' + member.user.discriminator + ` [${nicknames.get(usertage + '#' + member.user.discriminator)}]`), "gray")
					}
				} else {
					if (member.presence.status == "online") {
						logColor((usertage + '#' + member.user.discriminator), "green")
					} else if (member.presence.status == "dnd") {
						logColor((usertage + '#' + member.user.discriminator), "red")
					} else if (member.presence.status == "idle") {
						logColor((usertage + '#' + member.user.discriminator), "yellow")
					} else if (member.presence.status == "offline") {
						logColor((usertage + '#' + member.user.discriminator), "gray")
					}
				}
				})
    break
		case 'edit':
      let i = Number(args[1])
			let contents = emoji.emojify(String(args.join(" ")).replace(`edit ${args[1]} `, ""))
			messages[i].edit(contents)
			log(`edited "${messages[i].content}" to "${contents}"`)
    break
		case 'calc':
      let f = new Function(`${input.replace("calc ", "return ")}`)
			log(`result: ${f()}`)
    break
		case 'nick':
      let nickname = args[1]
			let usertag = String(args.join(" ")).replace(`nick ${args[1]} `, "")
			nicknames.set(usertag, nickname)
			usernames.set(nickname, usertag)
		break
		case 'prune':
		let o = 0
		let length = messages.length
		log("Deleting messages!")
      messages.forEach(m => {
				m.delete().then(() => {
					o = o+1
					if (o == length) {
						logColor("Messages deleted!", "green")
					}
				})
			})
			messages = []
			log("deleted all cached AxoBot messages")
		break
		case 'save':
		function save() {
			db.empty()
			db.set("usernames",Array.from(usernames.values())).then(() => {
				db.set("nicknames", Array.from(nicknames.values())).then(() => {
					db.set("messages", messages).then(() => {
						db.get("usernames").then(v => {
							if (v == null) {
								logErr("Error saving usernames")
								save()
							} else{
								db.get("nicknames").then(val => {
									if (val == null) {
										logErr("Error saving nicknames")
										save()
									} else {
										db.get("messages").then(msg => {
											if (msg == null) {
												logErr("Error saving messages")
												save()
											} else {
												logColor("saved!", "green")
											}
										})
									}
								})
							}
							})
					})
				})
			})
		}
		save()
		break
		case 'savemsg':
		db.delete("messages").then(() => {
				db.set("messages", messages).then(() => {
					logColor("saved messages!", "green")
				})
		})
		break
		case 'clrmsg':
			db.set("messages", []).then(() => {
			logColor("Deleted messages!", "green")
		})
		break
		case 'reply':
			let ii = Number(args[1])
			let contentss = emoji.emojify(String(args.join(" ")).replace(`reply ${args[1]} `, ""))
			let msgmsg = await other_messages[ii].reply(contentss)
			messages.push(msgmsg)
		break
		case 'load':
		usernames.clear()
		nicknames.clear()
		db.get("usernames").then(v => {
			db.get("nicknames").then(val => {
				v.forEach(function(item, index, array) {
					nicknames.set(item, val[index])
					usernames.set(val[index], item)
				})
				db.get("messages").then(msgs => {
					msgs.forEach(function(item, index, array) {
						item.fetch().then(m => {
							messages.push(m)
						})
					})
					logNote(msgs)
					logColor("loaded!", "green")
				})
			})
		})
		break
    default:
      let m = await setChannel.send(emoji.emojify(input.replace("send ", "")))
			messages.push(m)
    break
  }
})

/// Bot Initialization

client.on('ready', () => {
logColor((`Bot (${client.user.tag}) has logged in!`), 'green')
client.channels.fetch(defaultChannel)
.then(channel => {
  setChannel = channel
	discord_inited = true
	init.emit('init')
  })
})

client.login('NzA1MzQ3NjcwMDU0NjY2MjYw.XqqYNQ.NVlqpFcipU3figJPETkF5B6oH_k')

server.listen(4000, () => {
  console.log('listening on *:3000');
});