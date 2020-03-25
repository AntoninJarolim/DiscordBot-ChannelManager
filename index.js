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
            if(args[1] === '--help')
            return message.channel.send('Tento příkaz slouží pouze pro rychlou zkoušku funkčnosti bota!')
            else
            message.channel.send('Hou!')
            break;

        case 'delete':
            if(!args[1])
            return message.channel.send('Neni definovan druhy parametr!')
            if(args[1] === '--help')
            return message.channel.send('Smaže určitý počet zpráv podle druhého argumentu. Například !delete 5 smaže 5 zpráv.\nTato funkce funguje maximalně na 100 zpráv. Pokud je druhý argument větší než 100, smaže se 100. \nTato funkce má různé omezení od discordu, takže pokud to nefunguje, tak si je vyčerpal!')
            else
            if(args[1] > 100)
            args[1] = 100
            message.channel.bulkDelete(args[1])
            message.channel.send('Smazal si '+ args[1] + ' zpráv!')
            break;
        case 'info':
            if(args[1] === '--help')
            return message.channel.send('Tak sí píííííča?')
            else
            message.channel.send('Seznam příkazů: \n      hej \n      delete \nPoužij --help pro více info o každém z nich!')
        case 'spamuj':
            if(args[1] === '--help')
            return message.channel.send('Ano, tohle je naprosto otravné. V zasade to proste spamuje:)\nPoužij druhý argument pro počet zpráv které je třeba pospamovat.')
            else
            if(!args[1])
            return message.channel.send('Neni definovan druhy parametr!')
            var i;
            for (i = 0; i < args[1]; i++) {
                message.channel.send(i + 'je vetši než: ')
            }
                }
})

bot.login(token);


