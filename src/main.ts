import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import * as config from './config/keys'
import { AppModule } from './app.module'

const bootstrap = async (): Promise<void> => {
    const app = await NestFactory.create(AppModule)

    // Nest app configuration
	app.useGlobalPipes(new ValidationPipe())
	app.enableCors()

	// Start listening
    await app.listen(config.PORT)
}
bootstrap()
