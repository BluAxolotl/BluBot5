{}var colors = require('colors/safe')
const classes = require('./classes.js')
const bot = require('./bot.js')
const console = require('./console.js')
const log = console.log
const logData = console.logData
const logErr = console.logErr
const logNote = console.logNote
const logColor = console.logColor
const Axolotl = classes.Axolotl
const Discord = require('discord.js')
const client = new Discord.Client()


/// Vars ^ | Color Themes

colors.setTheme({
  data: ['italic', 'grey'],
  error: 'red'
})