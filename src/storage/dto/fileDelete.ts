import { IsNotEmpty, IsString } from 'class-validator'

export class FileDeleteDto {
    @IsNotEmpty()
    @IsString()
    readonly filename: string
}
