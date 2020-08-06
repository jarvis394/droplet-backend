import { IsNotEmpty, IsString } from 'class-validator'

export class FindFileDto {
  @IsNotEmpty()
  @IsString()
  readonly filename: string
}
