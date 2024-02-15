import TelegramBot from 'node-telegram-bot-api';
import { gameBtns, againBtn } from './btns.js';
import { ADMIN_CHAT_IDS } from './constants.js';
import { linksToRecipes, cookPhrases } from './data.js';
import stickers from './stickers.js';

const token = '6857673422:AAG4oN4pGTUy0i_jRnKfth41eN0Akwscfz0';
const bot = new TelegramBot(token, { polling: true });

const chats: { [key: string | number]: string | number } = {};

bot.setMyCommands([
  { command: '/start', description: 'Приветствие' },
  { command: '/info', description: 'Информация о прользователе чата' },
  { command: '/cook', description: 'Что бы приготовить?' },
  { command: '/game', description: 'Играть в игру "угадай число"' },
]);

const sendInitMessage = async () => {
  const msg = "I'm working";

  for await (const chatId of ADMIN_CHAT_IDS) {
    try {
      await bot.sendMessage(chatId, msg);
    } catch (error: any) {
      console.log('error sendMessage!', error.response.body.description, {
        chatId,
      });
    }
  }
};
sendInitMessage();

bot.on('message', async (msg: any) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  const firstName: string = msg.from.first_name;
  const lastName: string = msg.from.last_name ? msg.from.last_name : '';
  console.log(firstName, firstName);
  console.log(lastName, lastName);

  if (messageText === '/start') {
    await bot.sendSticker(
      chatId,
      'https://tlgrm.ru/_/stickers/85b/9a3/85b9a330-80ac-4e5d-a7b7-d63f5fab2e6b/3.webp'
    );
    return bot.sendMessage(
      chatId,
      `${firstName}, добро пожаловать в Машин Бот`
    );
  }
  if (messageText === '/info') {
    return bot.sendMessage(
      chatId,
      `Тебя зовут ${firstName} ${lastName}, а меня Бот Маши`
    );
  }
  if (messageText === '/cook') {
    return sendRecipe(chatId);
  }
  if (messageText === '/game') {
    return startGame(chatId);
  }

  return bot.sendMessage(
    chatId,
    'Я тебя не понимаю, попробуй выбрать что-то из меню'
  );
});

bot.on('callback_query', async (msg: any) => {
  const chatId: number = msg.message.chat.id;
  const answer: string = msg.data;
  if (answer === '/again') {
    return startGame(chatId);
  }
  if (answer == chats[chatId]) {
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

const startGame = async (chatId: number | string) => {
  await bot.sendMessage(
    chatId,
    'Я сейчас загадаю цифру, а ты попробуй ее отгадать'
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай', gameBtns);
};

const sendRecipe = async (chatId: number | string) => {
  const randomRecipeIdx = Math.floor(Math.random() * linksToRecipes.length);
  const randomPhraseIdx = Math.floor(Math.random() * cookPhrases.length);

  const chosenRecipe = linksToRecipes[randomRecipeIdx];
  const chosenPhrase = cookPhrases[randomPhraseIdx];
  await bot.sendMessage(chatId, `${chosenPhrase}: ${chosenRecipe}`);
};
