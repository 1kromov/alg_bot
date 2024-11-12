import { Markup } from 'telegraf';
import { UserAnswer } from '../models/user_answer.model.js';
import { Question } from '../models/question.model.js';
import { userProgress } from '../core/progress.js';


export async function sendNextQuestion(ctx: any, userId: string) {
  const userData = userProgress.get(userId);
  if (!userData) return;

  if (userData.currentQuestionIndex >= userData.questions.length) {
    await calculateScoreAndShowResult(ctx, userId);
    userProgress.delete(userId);
    return;
  }

  const question = userData.questions[userData.currentQuestionIndex];
  
  await ctx.reply(
    `${userData.currentQuestionIndex + 1}. ${question.getDataValue('text')}`,
    Markup.keyboard([
      [question.getDataValue('option1')],
      [question.getDataValue('option2')],
      [question.getDataValue('option3')],
      [question.getDataValue('option4')],
    ])
      .oneTime()
      .resize(),
  );

  userData.currentQuestionIndex++;
  userProgress.set(userId, userData); 
}



export async function calculateScoreAndShowResult(ctx: any, userId: string) {
  const userAnswers = await UserAnswer.findAll({ where: { user_id: userId } });
  let correctCount = 0;

  for (const answer of userAnswers) {
    const question = await Question.findByPk(answer.getDataValue('question_id'));
    if (question) {
      const correctOption = question.getDataValue('correctOption');

      if (!correctOption || ![1, 2, 3, 4].includes(correctOption)) {
        console.warn(`Invalid correctOption for question ID: ${question.getDataValue('id')}`);
        continue;
      }

      const correctAnswerKey = `option${correctOption}` as keyof typeof question;
      const correctAnswer = question.getDataValue(correctAnswerKey) ?? '';

      const userAnswer = answer.getDataValue('answer');
      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    }
  }

  await ctx.reply(`Tabriklayman! Siz ${correctCount} ta to'g'ri javob berdingiz.`);
  await ctx.reply('1-bosqich imtihonlarini yakunladingiz, natijalar tez kunda rasmiy kanalimizda e’lon qilinadi!');
}
