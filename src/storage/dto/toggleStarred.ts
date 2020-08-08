import { IsNotEmpty, IsString } from 'class-validator'

export class ToggleStarredDto {
    @IsNotEmpty()
    @IsString()
    readonly filename: string
}
