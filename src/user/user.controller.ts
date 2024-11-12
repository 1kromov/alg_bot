import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UsersService } from './user.service.js'
import { User } from '../models/user.model.js'
import { UserAnswer } from '../models/user_answer.model.js'
import { Question } from '../models/question.model.js'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with correct answer count' })
  @ApiResponse({
    status: 200,
    description: 'List of users with correct answer count',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          user_id: { type: 'string' },
          first_name: { type: 'string' },
          phone_number: { type: 'string' },
          year_old: { type: 'integer' },
          region: { type: 'string' },
          correctAnswersCount: { type: 'integer' },
        },
      },
    },
  })
  async getAllUsersWithCorrectAnswers() {
    return this.usersService.getUsersWithCorrectAnswers()
  }
}
