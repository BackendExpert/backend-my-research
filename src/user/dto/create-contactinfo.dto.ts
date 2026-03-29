import { IsString, IsUrl } from "class-validator";

export class CreateContactInfoDTO {
    @IsString()
    @IsUrl()
    website: string;

    @IsString()
    @IsUrl()
    linkedin: string;

    @IsString()
    twitter: string;
}