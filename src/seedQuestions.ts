import { Question } from './models/question.model.js'
import { sequelize } from './core/db.js'
import './core/initModels.js'
import { Attributes } from 'sequelize'

async function seedQuestions() {
  try {
    await sequelize.authenticate()
    await sequelize.sync()

    const questions = [
      {
        text: 'What is the capital of France?',
        option1: 'Paris',
        option2: 'London',
        option3: 'Berlin',
        option4: 'Madrid',
        correctOption: 1,
      },
      {
        text: 'What is 2 + 2?',
        option1: '3',
        option2: '4',
        option3: '5',
        option4: '6',
        correctOption: 2,
      },
      {
        text: 'Which of the following is an odd number?',
        option1: '4',
        option2: '6',
        option3: '7',
        option4: '8',
        correctOption: 3,
      },
      {
        text: 'What comes next in the sequence: 2, 4, 6, 8?',
        option1: '10',
        option2: '12',
        option3: '14',
        option4: '16',
        correctOption: 1,
      },
      {
        text: 'What is the square root of 16?',
        option1: '2',
        option2: '3',
        option3: '4',
        option4: '5',
        correctOption: 3,
      },
      {
        text: 'If you have 3 apples and take away 2, how many do you have?',
        option1: '1',
        option2: '2',
        option3: '3',
        option4: '0',
        correctOption: 2,
      },
      {
        text: 'What is the result of 5 * 6?',
        option1: '25',
        option2: '30',
        option3: '35',
        option4: '40',
        correctOption: 2,
      },
      {
        text: 'Which shape has 4 equal sides?',
        option1: 'Triangle',
        option2: 'Rectangle',
        option3: 'Circle',
        option4: 'Square',
        correctOption: 4,
      },
      {
        text: 'What is the next prime number after 7?',
        option1: '9',
        option2: '11',
        option3: '13',
        option4: '15',
        correctOption: 2,
      },
      {
        text: 'What is 15 divided by 3?',
        option1: '4',
        option2: '5',
        option3: '6',
        option4: '7',
        correctOption: 2,
      },
      {
        text: 'What comes next in the sequence: 1, 1, 2, 3, 5, ...?',
        option1: '6',
        option2: '7',
        option3: '8',
        option4: '9',
        correctOption: 3,
      },
      {
        text: 'How many sides does a hexagon have?',
        option1: '4',
        option2: '5',
        option3: '6',
        option4: '8',
        correctOption: 3,
      },
      {
        text: 'Which number is a multiple of both 2 and 3?',
        option1: '4',
        option2: '6',
        option3: '8',
        option4: '10',
        correctOption: 2,
      },
      {
        text: 'What is the largest planet in our solar system?',
        option1: 'Earth',
        option2: 'Mars',
        option3: 'Jupiter',
        option4: 'Saturn',
        correctOption: 3,
      },
      {
        text: 'Which one of these is a mammal?',
        option1: 'Shark',
        option2: 'Dolphin',
        option3: 'Octopus',
        option4: 'Lobster',
        correctOption: 2,
      },
      {
        text: 'If a car is traveling at 60 km/h, how far will it travel in 2 hours?',
        option1: '60 km',
        option2: '90 km',
        option3: '120 km',
        option4: '150 km',
        correctOption: 3,
      },
      {
        text: 'What comes next in the pattern: 5, 10, 15, 20, ...?',
        option1: '22',
        option2: '25',
        option3: '30',
        option4: '35',
        correctOption: 2,
      },
      {
        text: 'If it is 3 PM now, what time will it be in 6 hours?',
        option1: '9 PM',
        option2: '8 PM',
        option3: '7 PM',
        option4: '6 PM',
        correctOption: 1,
      },
      {
        text: 'What is the sum of angles in a triangle?',
        option1: '180 degrees',
        option2: '90 degrees',
        option3: '360 degrees',
        option4: '270 degrees',
        correctOption: 1,
      },
      {
        text: 'Which of the following is not a primary color?',
        option1: 'Red',
        option2: 'Green',
        option3: 'Blue',
        option4: 'Yellow',
        correctOption: 2,
      },
    ]

    for (const questionData of questions) {
      await Question.create(questionData as any) // Using `as any` to bypass type-checking
    }

    console.log('Questions seeded successfully!')
  } catch (error) {
    console.error('Error seeding questions:', error)
  } finally {
    await sequelize.close()
  }
}

seedQuestions()
export {}
