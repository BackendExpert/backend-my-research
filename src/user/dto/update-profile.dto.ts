import { IsString, IsOptional, IsArray, ValidateNested, IsDate, IsUrl, MaxLength } from "class-validator";
import { Type } from "class-transformer";


export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    fname: string;

    @IsOptional()
    @IsString()
    lname: string;

    @IsOptional()
    @IsString()
    bio: string;
}