require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const fileManager = require('fs');

const token = process.env.TOKEN;
const PREFIX = '!';

var date = new Date(); 
var razeni = 1;
var zpravy = [];


class TimedMessage{
    constructor(time, messageText, channelID){
        date = new Date();
        let x = time.split('-');
        let splitTime = x[0].split(":");
        date.setHours(splitTime[0], splitTime[1]);
        if(x[1])
        {
            let splitDate = x[1].split(".");
            date.setUTCFullYear(splitDate[2],splitDate[1] - 1,splitDate[0]);
        }
        this.time = date;
        this.messageText = messageText;
        this.channelID = channelID;
    }    
}
function deleteBlank(withBlank){
    //odstraní díry(undefined a " ") v seznamu
    withoutBlank = withBlank.filter(function(element){
        if (element != "" && element != null) {
            return element;
        }
    })
    return withoutBlank;
}
function timeValidation(unvalidated){
    //zčekne jestli je datum ve formatu 18:45 nebo 18:46-26.3.2019 nebo aani jedno
    let now = new Date();
    let x = unvalidated.split("-");
    let time = x[0];
    let date = x[1];
    if(time.length != 5)
    {
        return 'Špatně zapsaný čas!';
    }
    if(time.substring(2,3) != ':')
    {
        return 'Špatně zapsaný čas - neobsahuje ":" nebo je na špatném místě.'
    }
    let y = time.split(":");
    let hours = y[0];
    let mins = y[1];
    if(hours > 23 || hours <0 || mins > 60 || mins <0)
    {
        return 'Čas je mimo hranice!'
    }
    if(!date) //if is message gonna be sent today, check if time hasn't passed already 
    {       
        if(hours<now.getHours())
        {
            return 'Zpráva odeslána do minulosti!';
        }
        else{
            if(hours == now.getHours())
            {
                if(mins <now.getMinutes()){
                    return 'Zpráva odeslána do minulostI!';
                }
            }
        }
    }
    else //no need to do this stuff if date is undefined
    {
        if(date.length > 10)
        {
            return 'Špatně zadané datum!'
        }
        y = date.split('.');
        let day = y[0];
        let month = y[1];
        let year = y[2]
        if(day <1 || day >31)
        {
            return 'Takový den neexistuje!'
        }
        if(month <1 || month >12)
        {
            return 'Takový měsíc neexistuje!'
        }
        if(year <2020)
        {
            return 'Tvá zpráva byla odeslána do minulosti!'
        }
    }
    
    return '';
}
function stringsToObject(objectWithStrings){
    //objects inside object became string when is object read from file  
    let objectWithObjects = objectWithStrings;
    for (let i =0; i<objectWithStrings.length; i++)
    {
        objectWithObjects[i].time = new Date(objectWithStrings[i].time);
        //time string to Date object 
        objectWithObjects[i].channelID = bot.channels.resolve(objectWithStrings[i].channelID.id);
        //channel ID to Channel object 
        
    }
    return objectWithObjects;
}
bot.on('ready', () => {
    console.log('Booted!');
    bot.user.setActivity('tvojí mámu!', {type: 'WATCHING'})
    fileManager.readFile('.\\var\\timedMessages.json', (err, data) => {
        if (err) throw err;
        try
        {
            zpravy = JSON.parse(data);
            console.log('Načteno!')
        }
        catch{
            console.log('Nic se nečetlo - prazdny file!')
        }
        zpravy = stringsToObject(zpravy);
    });
});
bot.setInterval(function(){ 
    date = new Date();    
    if(zpravy[0])
    {
        //if(date.getHours() == zpravy[0].time.getHours() && date.getMinutes() == zpravy[0].time.getMinutes())
        if(zpravy[0].time.getTime() < date.getTime())
        {
            zpravy[0].channelID.send(zpravy[0].messageText);  
            zpravy.shift();
            fileManager.writeFile('.\\var\\timedMessages.json', JSON.stringify(zpravy, null, 2), function(err){
                if (err) return err;
            });
        }
    
    }
    
}, 3000);

bot.on('message', message => {

    if (razeni) {
        message.channel.setPosition(0);
    }

    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    //nepotrebuju aby program sel do switche, pokud zprava nezacina vykricnikem, nebo pokud to poslal bot
    let args = message.content.substring(PREFIX.length).split(" ");
    args = deleteBlank(args);
    switch (args[0]) {
        case 'hej':
            if (args[1] === '--help') {
                return message.channel.send('Tento příkaz slouží pouze pro rychlou zkoušku funkčnosti bota!')
            }
            else {
                message.channel.send('Hou!')
            }
            break;
        case 'info':
            if (args[1] === '--help') {
                return message.channel.send('Tak sí píííííča?')
            } else {
                message.channel.send('Seznam příkazů: \n      hej\n      smazkanal \n      delete \n      spamuj \n      razeni \nPoužij --help pro více info o každém z nich!')
            } 
            break;

        case 'delete':
            if (!args[1]) {
                return message.channel.send('Neni definovan druhy parametr! Použij --help!')
            }
            if (args[1] === '--help') {
                return message.channel.send('Smaže určitý počet zpráv podle druhého argumentu. Například !delete 5 smaže 5 zpráv.\nTato funkce funguje maximalně na 100 zpráv. Pokud je druhý argument větší než 100, smaže se 100. \nTato funkce má různé omezení od discordu, takže pokud to nefunguje, tak si je vyčerpal!')
            }
            else {

                if (args[1] > 100) {
                    args[1] = 100
                }
                message.channel.bulkDelete(args[1])
                message.channel.send('Smazal si ' + args[1] + ' zpráv!')
            }
            break;

        

        case 'spamuj':
            if (args[1] === '--help') {
                return message.channel.send('Ano, tohle je naprosto otravné. V zasade to proste spamuje:)\nPoužij druhý argument pro počet zpráv které je třeba pospamovat.')
            } else {
                if (!args[1]) {
                    return message.channel.send('Neni definovan druhy parametr! Použij --help!')
                }
                for (let i = 0; i < args[1]; i++) {
                    message.channel.send(i + ' je menší než: ' + args[1])
                }
            }
            break;

        case 'razeni':
            if (!args[1]) {
                return message.channel.send('Neni definovan druhy parametr! Použij --help!')
            }
            if (args[1] === '--help') {
                return message.channel.send('Tato funkce zapne seřazování zpráv podle nejnovější - když někdo napíše do jakéhokoliv kanálu, tak se objeví úplně nahoře.\nPoužij argumenty on/off pro zapnutí a vypnutí. ')
            }
            else {
                if (args[1] === 'on') {
                    razeni = 1;
                    message.channel.send('Zapl si řazení podle nejnovejší zprávy!')
                }
                else if (args[1] === 'off') {
                    razeni = 0;
                    message.channel.send('Vypl si řazení podle nejnovejší zprávy!')
                }
            }
            break;
        case 'smazkanal':
            if(!args[1]){
                return message.channel.send('Neni definovan druhy parametr! Použij --help!')
            }
            if (args[1] === '--help') {
                return message.channel.send('Tato funkce smaže kanál. \nJako druhý argument definuj přesné jméno kanálu, které chceš smazat.')
            }

            let nalezenychannel = message.guild.channels.cache.find(channel => channel.name === args[1]);           
            if (!nalezenychannel){
                return message.channel.send('Channel s tímto jménem nebyl nalezen!'); 
            }
            nalezenychannel.delete();
            return message.channel.send('Prave si smazal channel ' + args[1] + ' !');   
            break;
        case 'sendat':
            if(!args[1]){
                return message.channel.send('Neni definovan druhy parametr! Použij --help!')
            }
            if (args[1] === '--help') {
                return message.channel.send('Tato funkce umožňuje odeslat zprávu do určitého channelu v předem daný čas!\nPrvní arugument je čas. Jsou dva přijatelné formáty např.:\n   1. 18:46  - dneska v tento čas\n   2. 18:46-24.7.2020  - umožňuje specifikovat čas i den.\nJako druhý argument definuj přesné jméno kanálu, do kterého se bude zpráva odesílat.\nPoté už piš samotnou zprávu.\nNapříklad !sendat 18:46 tondajetop Tonda je nejlepsi!"')
            }
            //set time if valid 
            let time = args[1];
            let check = timeValidation(time);
            if(check)
            {
                message.channel.send(check);
                check = '';
                return ;
            }
            //set channel if exist
            let channelkamtoposle = message.guild.channels.cache.find(channel => channel.name === args[2]);           
            if (!channelkamtoposle){
                return message.channel.send('Channel s tímto jménem nebyl nalezen!'); 
            }       
            //create messageConcent of the rest of message       
            let messageContent = message.content.substring(PREFIX.length + args[0].length + args[1].length + args[2].length + 3);
            //create TimedMessage object using those defined variables
            zpravy.unshift(new TimedMessage(time, messageContent, channelkamtoposle));

            console.log('Zprava: "' + zpravy[0].messageText +'" bude odeslana v ' + zpravy[0].time + ' do kanalu ' + zpravy[0].channelID);
            message.channel.send('Zprava: "' + zpravy[0].messageText +'" bude odeslana v ' + time + ' do kanalu ' + channelkamtoposle);
            //many reasons to sort zpravy by time 
            if(zpravy[1])
            {
                zpravy.sort(function(a, b) { return a.time - b.time})
            }
            //save TimedMessages in case of outage
            fileManager.writeFile('.\\var\\timedMessages.json', JSON.stringify(zpravy, null, 2), function(err){
                if (err) return err;
            });
    }

})

bot.login(token);