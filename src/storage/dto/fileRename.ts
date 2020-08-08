import { IsString, IsNotEmpty } from 'class-validator'

export class FileRenameDto {
    @IsString()
    @IsNotEmpty()
    readonly filename: string

    @IsString()
    @IsNotEmpty()
    readonly updatedName: string
}
