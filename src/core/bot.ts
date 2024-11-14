import { Markup, Telegraf } from 'telegraf'
import { sequelize } from './db.js'
import * as dotenv from 'dotenv'
import { User } from '../models/user.model.js'
import { sendNextQuestion, calculateScoreAndShowResult } from '../actions/start.js'
import { Question } from '../models/question.model.js'
import { userProgress } from './progress.js'
import { Attributes, CreationAttributes } from 'sequelize'
import { UserAnswer } from '../models/user_answer.model.js'

dotenv.config()

const token = process.env.BOT_TOKEN as string
export const bot = new Telegraf(token)

bot.start(async (ctx) => {
  console.log('Received /start command')
  const userId = String(ctx.from.id)

  try {
    const existingUser = await User.findOne({ where: { user_id: userId } })
    if (existingUser) {
      await ctx.reply('Siz roʻyxatdan oʻtib boʻlgansiz!')
      return
    }
  } catch (error) {
    console.error('Error checking user registration:', error)
    await ctx.reply('Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.')
    return
  }

  await ctx.replyWithPhoto('AgACAgIAAxkBAAObZzSuMNpz9G3gaidZY3QP1xoqMgkAApfkMRs7XqBJo5SbdS8Qd5YBAAMCAANzAAM2BA', {
    caption:
      "🎓 <b>Namangandagi ALGORITM IT o'quv markazi, yoshlar uchun 222 million so'mlik grand e'lon qiladi!</b>\n\n" +
      "🏆 <b>Grant tanlovi g'oliblari “ALGORITM maxsus sertifikatlari va qo'shimcha sovg'alar bilan taqdirlanishadi.</b>\n\n" +
      '<b>Eng asosiysi:</b>\n' +
      '• Web-dasturlash\n' +
      '• Kiber-xavfsizlik\n' +
      '• SMM va Marketing\n' +
      "• Sun'iy intelekt\n" +
      '• Grafik dizayn\n\n' +
      "<b>Kabi kurslarimizdan birida mutlaqo bepulga to'liq kursni o'qish imkoniyatiga ega bo'ladilar!</b>\n\n" +
      "🔥 <b>Tanlovda ishtirok eting va maxsus mukofotlarga ega bo'ling!</b>",
    parse_mode: 'HTML',
  })

  userProgress.set(userId, {
    step: 'name',
    currentQuestionIndex: 0,
    questions: [],
    isQuizActive: false,
    tempData: {},
  })

  await ctx.reply(
    '<u>Ism</u> va <u>Familiyangizni</u> lotin alifbosida to’liq kiriting. <i>(Masalan: Ikromov Abdulaziz)</i>',
    { parse_mode: 'HTML' },
  )
})

bot.on('photo', (ctx) => {
  console.log('File ID:', ctx.message.photo[0].file_id)
  ctx.reply('Got the file ID!')
})

bot.on('text', async (ctx) => {
  const userId = String(ctx.from.id)
  const userData = userProgress.get(userId)
  if (!userData) {
    await ctx.reply('Iltimos, ro’yxatdan o’tishni /start buyrug’i bilan boshlang.')
    return
  }
  console.log(userData.step)

  switch (userData.step) {
    case 'name':
      userData.tempData!.name = ctx.message.text
      userData.step = 'phone'
      userProgress.set(userId, userData)
      await ctx.reply(
        '👨🏻‍💻 Ro’yxatdan o’tish uchun raqamingizni tasdiqlashingiz lozim👇 <i>(Masalan: 998938888038)</i>',
        { parse_mode: 'HTML' },
      )
      // await ctx.reply('👨🏻‍💻 Ro’yxatdan o’tish uchun raqamingizni tasdiqlashingiz lozim👇')
      break

    case 'phone': {
      const phone = ctx.message.text
      if (!/^998\d{9}$/.test(phone)) {
        await ctx.reply('Noto’g’ri format. Iltimos, telefon raqamingizni 998XXXXXXXXX formatida kiriting.')
        return
      }

      const existingUser = await User.findOne({ where: { phone_number: phone } })
      if (existingUser) {
        await ctx.reply(
          "Bu telefon raqam bilan ro'yxatdan o'tgan foydalanuvchi mavjud. Iltimos, boshqa telefon raqamini kiriting.",
        )
        return
      }

      userData.tempData!.phone = phone
      userData.step = 'age'
      userProgress.set(userId, userData) // Save progress
      await ctx.reply('3. Yoshingiz nechida?')
      break
    }

    case 'age': {
      const age = parseInt(ctx.message.text)
      if (isNaN(age) || age <= 0 || age > 120) {
        await ctx.reply('Iltimos, haqiqiy yoshingizni kiriting.')
        return
      }

      userData.tempData!.age = age
      userData.step = 'region'
      userProgress.set(userId, userData) // Save progress
      await ctx.reply('🏠Yashash manzilingiz qayerda?')
      break
    }

    case 'region':
      userData.tempData!.region = ctx.message.text
      userData.step = 'readyForExam'
      userProgress.set(userId, userData)

      // Save user data in the User table
      await User.create({
        user_id: userId,
        first_name: userData.tempData!.name,
        phone_number: userData.tempData!.phone,
        year_old: userData.tempData!.age,
        region: userData.tempData!.region,
      })

      await ctx.reply(
        "Tabriklaymiz, Siz muvaffaqiyatli ro'yxatdan o'tdingiz!\n\n" +
          '🎓 <b>"ALGORITM TA\'LIM GRANTI"</b>\n' +
          "tanlovida qatnashing, bilimingizni sinovdan o'tkazing va mutlaqo bepulga o'qish imkoniyatiga ega bo'ling 🎁\n\n" +
          '✅ Ushbu bot orqali sizga 20 talik IQ darajangizni sinovchi 1- bosqich imtihon testlari beriladi!\n' +
          'Bu testlardan eng baland ball yiqqan 100 kishi 2-bosqich imtihonlarga chaqiriladi!\n\n' +
          "📝 2- bosqich imtihonlari offline bo'lib o'tadi.\n" +
          "Imtihondan so'ng GRAND sohiblari rasmiy kanalimizda e'lon qilinadi!\n\n" +
          "⚠️ Agar tayyor bo'lsangiz, <b>Tayyorman</b> tugmasini bosing!",
        {
          parse_mode: 'HTML',
          ...Markup.keyboard(['Tayyorman']).oneTime().resize(),
        },
      )

      break

    case 'readyForExam':
      if (ctx.message.text === 'Tayyorman') {
        userData.isQuizActive = true
        userData.step = 'exam'
        userData.questions = await Question.findAll({ order: [['id', 'ASC']] })
        userData.currentQuestionIndex = 0
        userProgress.set(userId, userData)
        await sendNextQuestion(ctx, userId)
      }
      break

    case 'exam':
      if (userData.isQuizActive) {
        const question = userData.questions[userData.currentQuestionIndex - 1]

        try {
          await UserAnswer.create({
            user_id: userId,
            question_id: question.id,
            answer: ctx.message.text,
          })
        } catch (error) {
          console.error('Error saving user answer:', error)
          await ctx.reply('There was an issue saving your answer. Please try again.')
          return
        }

        await sendNextQuestion(ctx, userId)
      } else {
        await ctx.reply('Kutilmagan buyruq.')
      }
      break
  }
})

bot.launch()

export const startBot = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()

    console.log('Bot connected to the database.')
    console.log('Bot is running with polling...')

    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
  } catch (error) {
    console.error('Failed to start the bot:', error)
  }
}
