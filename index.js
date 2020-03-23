require('dotenv').config();
const Discord = require('discord.js');
const  bot = new Discord.Client();

const token = process.env.TOKEN;

const PREFIX = '!';


bot.on('message', message=>{
    message.channel.setPosition(0);
})

bot.login(token);


