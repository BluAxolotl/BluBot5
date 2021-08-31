const Discord = require('discord.js')
const client = new Discord.Client()
const { Client, MessageEmbed } = require('discord.js')

class Axolotl {
  constructor(name, age, color, size, ability) {
    this.name = String(name)
    this.age = Number(age)
    this.color = String(color)
    this.size = Number(size)
    this.ability = String(ability)
  }
}
class AxolotlEmbed {
  constructor(name, age, color, size, ability) {
    this.embed = new MessageEmbed()
    .setTitle(`**${name}**`)
    .setDescription(`age: *${age}*\ncolor: *${color}*\nsize: *${size}*\nability: *${ability}*`)
    .setColor(`#024ACA`)
    .setFooter('Bot developed by: BluAxolotl')
  }
}

module.exports = {
  Axolotl: Axolotl,
  AxolotlEmbed: AxolotlEmbed
}