const Discord = require('discord.js');
const  bot = new Discord.Client();

const token = 'NjkxMDUzNjk2OTU1NTgwNDU3.XnaX7g.pS98N3Jfmr1zfa6Y-e3nUnEjBCI';
const PREFIX = '!';


bot.on('message', message=>{
    message.channel.setPosition(0);
})

bot.login(token);


