import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({ message: 'category name is required.' })
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly description?: string;
}
