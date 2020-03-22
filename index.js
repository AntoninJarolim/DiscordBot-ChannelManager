const Discord = require('discord.js');
const  bot = new Discord.Client();

const token = 'NjkxMDUzNjk2OTU1NTgwNDU3.XnfDpw.xooZ421Ykcndt4RMDRZnL0c6-9s';

const PREFIX = '!';


bot.on('message', message=>{
    message.channel.setPosition(0);
})

bot.login(token);


