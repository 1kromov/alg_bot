import { Markup } from 'telegraf'
import { UserAnswer } from '../models/user_answer.model.js'
import { Question } from '../models/question.model.js'
import { userProgress } from '../core/progress.js'

// export async function sendNextQuestion(ctx: any, userId: string) {
//   const userData = userProgress.get(userId)
//   if (!userData) return

//   // Savol mavjudligini tekshirish
//   if (userData.currentQuestionIndex >= userData.questions.length) {
//     userData.isQuizActive = false
//     userData.step = ''
//     await calculateScoreAndShowResult(ctx, userId)
//     userProgress.delete(userId) // Clear progress after finishing
//     return
//   }

//   const question = userData.questions[userData.currentQuestionIndex]

//   // Agar savol mavjud bo'lmasa, foydalanuvchiga xatolik haqida xabar beriladi
//   if (!question) {
//     await ctx.reply("Savolni olishda xato yuz berdi. Iltimos, keyinroq qaytib ko'ring.")
//     return
//   }

//   // Savolni yuborish
//   await ctx.reply(
//     `${userData.currentQuestionIndex + 1}. ${question.getDataValue('text')}`,
//     Markup.keyboard([
//       [question.getDataValue('option1')],
//       [question.getDataValue('option2')],
//       [question.getDataValue('option3')],
//       [question.getDataValue('option4')],
//     ])
//       .oneTime()
//       .resize(),
//   )

//   // Savol ko'rsatilgandan so'ng indeksni oshirish
//   userData.currentQuestionIndex++
//   userProgress.set(userId, userData)
// }

export async function sendNextQuestion(ctx: any, userId: string) {
  const userData = userProgress.get(userId)
  if (!userData) return

  // Check if there are more questions
  if (userData.currentQuestionIndex >= userData.questions.length) {
    userData.isQuizActive = false
    userData.step = ''
    await calculateScoreAndShowResult(ctx, userId) // Show final results
    userProgress.delete(userId) // Clear progress after finishing
    return
  }

  const question = userData.questions[userData.currentQuestionIndex]

  // Send the question to the user
  await ctx.reply(
    `${userData.currentQuestionIndex + 1}. ${question.text}`,
    Markup.keyboard([[question.option1], [question.option2], [question.option3], [question.option4]])
      .oneTime()
      .resize(),
  )

  // Increment the index after sending the question
  userData.currentQuestionIndex++
  userProgress.set(userId, userData)
}
export async function calculateScoreAndShowResult(ctx: any, userId: string) {
  const userAnswers = await UserAnswer.findAll({ where: { user_id: userId } })
  let correctCount = 0

  for (const answer of userAnswers) {
    const question = await Question.findByPk(answer.getDataValue('question_id'))
    if (question) {
      const correctOption = question.getDataValue('correctOption')

      if (!correctOption || ![1, 2, 3, 4].includes(correctOption)) {
        console.warn(`Invalid correctOption for question ID: ${question.getDataValue('id')}`)
        continue
      }

      const correctAnswerKey = `option${correctOption}` as keyof typeof question
      const correctAnswer = question.getDataValue(correctAnswerKey) ?? ''

      const userAnswer = answer.getDataValue('answer')
      if (userAnswer === correctAnswer) {
        correctCount++
      }
    }
  }
  await ctx.reply('Siz barcha testlarni toʻldirdingiz! Natijalar tayyorlanmoqda...')
  await ctx.reply('1-bosqich imtihonlarini yakunladingiz, natijalar tez kunda rasmiy kanalimizda e’lon qilinadi!')
  await ctx.reply(`Tabriklayman! Siz ${correctCount} ta to'g'ri javob berdingiz.`)
}
