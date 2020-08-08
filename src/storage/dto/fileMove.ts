import { IsString, IsNotEmpty } from 'class-validator'

export class FileMoveDto {
    @IsString()
    @IsNotEmpty()
    readonly filename: string

    @IsString()
    @IsNotEmpty()
    readonly destination: string
}
