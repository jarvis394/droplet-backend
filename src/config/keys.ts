import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as Joi from '@hapi/joi'
import * as path from 'path'

type EnvConfig = Record<string, string>

/**
 * Joi validation schema
 */
const envVarsSchema: Joi.ObjectSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  GOOGLE_APPLICATION_CREDENTIALS: Joi.string()
})

/**
 * Validates config by Joi schema
 * @param config Enviroment config
 */
const validate = (config: EnvConfig): EnvConfig => {
  const { error, value: validatedEnvConfig } = envVarsSchema.validate(config)
  if (error) {
    throw new Error(`Config validation error: ${error.message}`)
  }
  return validatedEnvConfig
}

const filePath: string = path.resolve(__dirname, '../../.env')
const env: EnvConfig = validate(dotenv.parse(fs.readFileSync(filePath)))

/**
 * Application main port
 */
export const PORT = Number(env.PORT)

/**
 * GCS bucket name
 */
export const BUCKET_NAME = 'my-droplet.appspot.com'
