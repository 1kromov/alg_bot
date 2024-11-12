import { Injectable } from '@nestjs/common'
import { User } from '../models/user.model.js'
import { UserAnswer } from '../models/user_answer.model.js'
import { Question } from '../models/question.model.js'
import { Sequelize, Op } from 'sequelize'

@Injectable()
export class UsersService {
  constructor(private sequelize: Sequelize) {}

  async getUsersWithCorrectAnswers() {
    const users = await User.findAll()

    const userDataWithCorrectAnswers = await Promise.all(
      users.map(async (user) => {
        const correctAnswersCount = await UserAnswer.count({
          where: { user_id: user.user_id },
          include: [
            {
              model: Question,
              required: true,
              where: this.sequelize.where(
                this.sequelize.col('Question.correctOption'),
                Op.eq,
                this.sequelize.col('UserAnswer.answer'),
              ),
            },
          ],
        })

        return {
          user_id: user.user_id,
          first_name: user.first_name,
          phone_number: user.phone_number,
          year_old: user.year_old,
          region: user.region,
          correctAnswersCount,
        }
      }),
    )

    return userDataWithCorrectAnswers
  }
}
