import { Question } from '../models/question.model.js'

export async function checkAnswer(questionId: number, userAnswer: string): Promise<boolean> {
  const question = await Question.findByPk(questionId)
  if (!question) {
    throw new Error('Question not found')
  }

  const correctOption = question.getDataValue('correctOption')

  if (!correctOption || typeof correctOption !== 'number') {
    throw new Error('Correct option is not defined or invalid')
  }

  const correctAnswerKey = `option${correctOption}` as keyof typeof question
  const correctAnswer = question.getDataValue(correctAnswerKey) ?? ''

  return userAnswer === correctAnswer
}
