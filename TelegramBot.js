const { Telegraf } = require('telegraf');
const amqp = require('amqplib');
const moment = require("moment");
const bot = new Telegraf("INSERT_TOKEN_HERE")
const chatId = "CHAT_ID"

//Wait for the connection

connect();


bot.start((ctx) => { ctx.reply(`Welcome ${ctx.update.message.chat.first_name}!Don't stop the bot if you want check the pH `); });

bot.action("manually", (ctx) => {
    bot.telegram.sendMessage(chatId, "I'm coming for releasing something in the water for adjusting the pH");
    ctx.deleteMessage();
    setTimeout(function () {

        var str = "🔨 Now, I'm here and I'm releasing something in the water for adjusting the value of pH. Thank you for advising me." + moment().format("MMMM Do YYYY,h:mm:ss a");

        ctx.reply(str);
    })
});
bot.action("callFamily", (ctx) => {
    bot.telegram.sendMessage(chatId, "I'm warning someone for adjusting the pH value");
    ctx.deleteMessage();
    setTimeout(function () {

        var str = "🧔🏻 Now, your dad is here for adjsting the value of pH and refill the fish with food.\n\n Date: " + moment().format("MMMM Do YYYY,h:mm:ss a");

        ctx.reply(str);
    }, 500)
});
bot.action("automatically", (ctx) => {
    bot.telegram.sendMessage(chatId, "Don't worry, I'm here for you!");
    ctx.deleteMessage();
    setTimeout(function () {

        var str = "🔨 Now, I'm releasing something in the water for adjusting the value of pH, enjoy your life! Date: " + moment().format("MMMM Do YYYY,h:mm:ss a");

        ctx.reply(str);
    }, 500)

});



bot.launch()


function connect() {
    amqp.connect('amqp://guest:guest@"YOUR_IP_ADDRESS":5672').then(function (conn) {

        //process.once('SIGINT', function () { conn.close(); });
        return conn.createChannel().then(function (ch) {

            var ok = ch.assertQueue('iot/alerts', { durable: false });

            ok = ok.then(function (_qok) {
                return ch.consume('iot/alerts', function (msg) {
                    //console.log("Mess " + msg.content.toString())
                    waitForAction(msg);
                }, { noAck: true });
            });

            return ok.then(function (_consumeOk) {
                console.log(' Telegram Bot is running ');
            });
        });
    }).catch(console.warn);
}

function waitForAction(msg) {

    // * Opzioni per callback
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Adjust pH manually",
                        callback_data: "manually",
                    },
                ],
                [
                    {
                        text: "Adjust pH automatically",
                        callback_data: "automatically",
                    },
                ],
                [
                    {
                        text: "Adjust pH with family",
                        callback_data: "callFamily",
                    },
                ],
            ],
        },
    };

    // Messaggio al bot
    bot.telegram.sendMessage(
        chatId,
        `Hey! The pH of the water is bad. pH is at ${msg.content.toString()}!\nWhat do you do?`,
        options
    );
}



