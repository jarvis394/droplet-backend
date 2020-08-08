import { IsString, IsOptional } from 'class-validator'

export class FindAllDto {
    @IsString()
    @IsOptional()
    readonly filename?: string
}
