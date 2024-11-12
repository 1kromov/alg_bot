import { User } from '../models/user.model.js'
import { UserAnswer } from '../models/user_answer.model.js'
import { Question } from '../models/question.model.js'

export function setupAssociations() {
  User.hasMany(UserAnswer, { foreignKey: 'user_id' })
  UserAnswer.belongsTo(User, { foreignKey: 'user_id' })

  Question.hasMany(UserAnswer, { foreignKey: 'question_id' })
  UserAnswer.belongsTo(Question, { foreignKey: 'question_id' })
}

export { User, UserAnswer, Question }
