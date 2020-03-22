const Discord = require('discord.js');
const  bot = new Discord.Client();

const token = 'NjkxMDUzNjk2OTU1NTgwNDU3.Xne_rw.XO9fIw2p_q8a_PUFoLt_iXt5gYw';

const PREFIX = '!';


bot.on('message', message=>{
    message.channel.setPosition(0);
})

bot.login(token);


