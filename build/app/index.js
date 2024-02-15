"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const btns_js_1 = require("./btns.js");
const constants_js_1 = require("./constants.js");
const data_js_1 = require("./data.js");
const token = '6857673422:AAG4oN4pGTUy0i_jRnKfth41eN0Akwscfz0';
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
const chats = {};
bot.setMyCommands([
    { command: '/start', description: 'Приветствие' },
    { command: '/info', description: 'Информация о прользователе чата' },
    { command: '/cook', description: 'Что бы приготовить?' },
    { command: '/game', description: 'Играть в игру "угадай число"' },
]);
const sendInitMessage = async () => {
    const msg = "I'm working";
    for await (const chatId of constants_js_1.ADMIN_CHAT_IDS) {
        try {
            await bot.sendMessage(chatId, msg);
        }
        catch (error) {
            console.log('error sendMessage!', error.response.body.description, {
                chatId,
            });
        }
    }
};
sendInitMessage();
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
    const firstName = msg.from.first_name;
    const lastName = msg.from.last_name ? msg.from.last_name : '';
    if (messageText === '/start') {
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/85b/9a3/85b9a330-80ac-4e5d-a7b7-d63f5fab2e6b/3.webp');
        return bot.sendMessage(chatId, `${firstName}, добро пожаловать в Машин Бот`);
    }
    if (messageText === '/info') {
        return bot.sendMessage(chatId, `Тебя зовут ${firstName} ${lastName}, а меня Бот Маши`);
    }
    if (messageText === '/cook') {
        return sendRecipe(chatId);
    }
    if (messageText === '/game') {
        return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй выбрать что-то из меню');
});
bot.on('callback_query', async (msg) => {
    const chatId = msg.message.chat.id;
    const answer = msg.data;
    if (answer === '/again') {
        return startGame(chatId);
    }
    if (answer == chats[chatId]) {
        return await bot.sendMessage(chatId, `Поздравляю, ты угадал число ${chats[chatId]}`, btns_js_1.againBtn);
    }
    else {
        return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал число ${chats[chatId]}`, btns_js_1.againBtn);
    }
});
const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я сейчас загадаю цифру, а ты попробуй ее отгадать');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', btns_js_1.gameBtns);
};
const sendRecipe = async (chatId) => {
    const randomRecipeIdx = Math.floor(Math.random() * data_js_1.linksToRecipes.length);
    const randomPhraseIdx = Math.floor(Math.random() * data_js_1.cookPhrases.length);
    const chosenRecipe = data_js_1.linksToRecipes[randomRecipeIdx];
    const chosenPhrase = data_js_1.cookPhrases[randomPhraseIdx];
    await bot.sendMessage(chatId, `${chosenPhrase}: ${chosenRecipe}`);
};
