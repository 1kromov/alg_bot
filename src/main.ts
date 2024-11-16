import dotenv from 'dotenv'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { startBot } from './core/bot.js'
import { sequelize } from './core/db.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT || 3000

  console.log('Starting bot...')
  await startBot()
  await app.listen(port)
  console.log(`Server is running on http://localhost:${port}`)
  // sequelize.sync({ force: true })
}

bootstrap()
