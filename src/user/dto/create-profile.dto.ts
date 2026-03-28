import { IsString, IsOptional, IsArray, ValidateNested, IsDate, IsUrl, MaxLength } from "class-validator";
import { Type } from "class-transformer";


export class CreateProfileDto {
    @IsString()
    fname: string;

    @IsString()
    lname: string;

    @IsString()
    bio: string;

    @IsString()
    title: string;
}