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

// Start command to begin registration
bot.start(async (ctx) => {
  console.log('Received /start command')
  const userId = String(ctx.from.id)

  // Reset the user progress if they restart the registration process
  userProgress.set(userId, {
    step: 'name',
    currentQuestionIndex: 0,
    questions: [],
    isQuizActive: false,
    tempData: {}, // Store temporary data here until registration is complete
  })

  await ctx.reply(
    'Assalomu aleykum! Do’stim! Kelajagingizga katta qadam tashlash uchun xush kelibsiz! Keling yaqindan tanishib olamiz, undan so’ng 1-bosqich imtihonlariga o’tamiz!',
  )
  await ctx.reply('1. Ismi Familyangiz?')
})

bot.help(async (ctx) => {
  await ctx.reply(`<b>Bosh sahifa!</b>`, {
    parse_mode: 'HTML',
    ...Markup.keyboard([['Royxatdan otish']])
      .oneTime()
      .resize(),
  })
})

// bot.on('text', async (ctx) => {
//   const userId = String(ctx.from.id)
//   const userData = userProgress.get(userId)

//   if (!userData) {
//     await ctx.reply('Iltimos, ro’yxatdan o’tishni /start buyrug’i bilan boshlang.')
//     return
//   }

//   switch (userData.step) {
//     case 'name':
//       userData.tempData!.name = ctx.message.text
//       userData.step = 'phone'
//       await ctx.reply('2. Telefon raqamingiz?')
//       break
//     case 'phone': {
//       const phone = ctx.message.text
//       if (!/^998\d{9}$/.test(phone)) {
//         await ctx.reply('Noto’g’ri format. Iltimos, telefon raqamingizni 998XXXXXXXXX formatida kiriting.')
//         return
//       }

//       const existingUser = await User.findOne({ where: { phone_number: phone } })
//       if (existingUser) {
//         await ctx.reply(
//           "Bu telefon raqam bilan ro'yxatdan o'tgan foydalanuvchi mavjud. Iltimos, boshqa telefon raqamini kiriting.",
//         )
//         return
//       }

//       userData.tempData!.phone = phone
//       userData.step = 'age'
//       await ctx.reply('3. Yoshingiz nechida?')
//       break
//     }
//     case 'age': {
//       const age = parseInt(ctx.message.text)
//       if (isNaN(age) || age <= 0 || age > 120) {
//         await ctx.reply('Iltimos, haqiqiy yoshingizni kiriting.')
//         return
//       }

//       userData.tempData!.age = age
//       userData.step = 'region'
//       await ctx.reply('4. Yashash manzilingiz?')
//       break
//     }
//     case 'region':
//       userData.tempData!.region = ctx.message.text

//       await ctx.reply(
//         'Tabriklayman, muvaffaqiyatli ro’yxatdan o’tdingiz! Tayyor bo’lsangiz, "Tayyorman" deb yozing!',
//         Markup.keyboard(['Tayyorman']).oneTime().resize(),
//       )
//       userData.step = 'readyForExam'
//       break
//     case 'readyForExam':
//       if (ctx.message.text === 'Tayyorman') {
//         userData.isQuizActive = true
//         userData.questions = await Question.findAll({ order: [['id', 'ASC']] })
//         await sendNextQuestion(ctx, userId)
//       }
//       break
//     default:
//       if (userData.isQuizActive) {
//         const question = userData.questions[userData.currentQuestionIndex - 1]

//         try {
//           await UserAnswer.create({
//             user_id: userId,
//             question_id: question.id,
//             answer: ctx.message.text,
//           });
//         } catch (error) {
//           console.error("Error saving user answer:", error);
//           await ctx.reply("There was an issue saving your answer. Please try again.");
//           return;
//         }

//         await sendNextQuestion(ctx, userId)

//         if (userData.currentQuestionIndex >= userData.questions.length) {
//           userData.isQuizActive = false
//           await ctx.reply('Siz barcha testlarni toʻldirdingiz! Natijalar tayyorlanmoqda...')

//           await User.create({
//             user_id: userId,
//             phone_number: userData.tempData?.phone ?? '',
//             first_name: userData.tempData?.name ?? '',
//             year_old: userData.tempData?.age ?? 0,
//             region: userData.tempData?.region ?? '',
//           })

//           await calculateScoreAndShowResult(ctx, userId)
//           userProgress.delete(userId)
//         }
//       } else {
//         await ctx.reply('Kutilmagan buyruq.')
//       }
//   }
// })

bot.on('text', async (ctx) => {
  const userId = String(ctx.from.id)
  const userData = userProgress.get(userId)

  if (!userData) {
    await ctx.reply('Iltimos, ro’yxatdan o’tishni /start buyrug’i bilan boshlang.')
    return
  }

  switch (userData.step) {
    case 'name':
      userData.tempData!.name = ctx.message.text
      userData.step = 'phone'
      userProgress.set(userId, userData) // Save progress
      await ctx.reply('2. Telefon raqamingiz?')
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
      await ctx.reply('4. Yashash manzilingiz?')
      break
    }

    case 'region':
      userData.tempData!.region = ctx.message.text
      await ctx.reply(
        'Tabriklayman, muvaffaqiyatli ro’yxatdan o’tdingiz! Tayyor bo’lsangiz, "Tayyorman" deb yozing!',
        Markup.keyboard(['Tayyorman']).oneTime().resize(),
      )
      userData.step = 'readyForExam'
      userProgress.set(userId, userData) // Save progress
      break

    case 'readyForExam':
      if (ctx.message.text === 'Tayyorman') {
        userData.isQuizActive = true
        userData.questions = await Question.findAll({ order: [['id', 'ASC']] })
        userData.currentQuestionIndex = 0
        userProgress.set(userId, userData) // Save progress
        await sendNextQuestion(ctx, userId) // Start the quiz
      }
      break

    default:
      if (userData.isQuizActive) {
        const question = userData.questions[userData.currentQuestionIndex - 1]

        // Save the user's answer
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

        // Send the next question
        await sendNextQuestion(ctx, userId)

        // Check if the quiz is finished
        if (userData.currentQuestionIndex >= userData.questions.length) {
          userData.isQuizActive = false
          await ctx.reply('Siz barcha testlarni toʻldirdingiz! Natijalar tayyorlanmoqda...')
          await calculateScoreAndShowResult(ctx, userId)
          userProgress.delete(userId) // Clear progress after finishing
        }
      } else {
        await ctx.reply('Kutilmagan buyruq.')
      }
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
