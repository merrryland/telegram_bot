import TelegramBot from 'node-telegram-bot-api';
import { gameBtns, againBtn } from './btns.js';

const token = '6857673422:AAG4oN4pGTUy0i_jRnKfth41eN0Akwscfz0';
const bot = new TelegramBot(token, { polling: true });

bot.setMyCommands([
  { command: '/start', description: 'Приветствие' },
  { command: '/info', description: 'Информация о прользователе чата' },
  { command: '/game', description: 'Играть в игру "угадай число"' },
]);

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    'Я сейчас загадаю цифру, а ты попробуй ее отгадать'
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай', gameBtns);
};

const startBot = () => {
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
    console.log(msg);
    if (messageText === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/85b/9a3/85b9a330-80ac-4e5d-a7b7-d63f5fab2e6b/3.webp'
      );
      return bot.sendMessage(
        chatId,
        `${msg.from.first_name}, добро пожаловать в Машин Бот`
      );
    }
    if (messageText === '/info') {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name}, а меня Бот Маши`
      );
    }
    if (messageText === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз');
  });

  bot.on('callback_query', async (msg) => {
    const chatId = msg.message.chat.id;
    const answer = msg.data;
    if (answer === '/again') {
      return startGame(chatId);
    }
    if (answer === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Поздравляю, ты угадал число ${chats[chatId]}`,
        againBtn
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал число ${chats[chatId]}`,
        againBtn
      );
    }
  });
};

startBot();
