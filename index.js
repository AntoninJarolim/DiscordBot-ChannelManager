const Discord = require('discord.js');
const  bot = new Discord.Client();

const token = 'NjkxMDUzNjk2OTU1NTgwNDU3.XnfC9w.q-2Y89xHcoNOag8ic0SUwvCt8R4';

const PREFIX = '!';


bot.on('message', message=>{
    message.channel.setPosition(0);
})

bot.login(token);


