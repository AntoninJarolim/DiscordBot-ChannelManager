require('dotenv').config();
const Discord = require('discord.js');
const  bot = new Discord.Client();

const token = process.env.TOKEN;

const PREFIX = '!';

bot.on( 'ready' , () => {
    console.log( 'Robí!');
})



bot.on('message', message=>{
    message.channel.setPosition(0);

    let args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'hej':
            message.channel.send('Hou!')
            break;

        case 'delete':
            if(!args[1])
            return message.channel.send('Neni definovan druhy parametr!')
            else
            message.channel.bulkDelete(args[1])
    }
})

bot.login(token);


