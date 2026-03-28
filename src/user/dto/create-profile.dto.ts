import { IsString, IsOptional, IsArray, ValidateNested, IsDate, IsUrl, MaxLength } from "class-validator";
import { Type } from "class-transformer";


export class EducationDto {
    @IsString()
    institute_name: string;

    @IsString()
    course: string;

    @IsDate()
    @Type(() => Date)
    start_at: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    end_at?: Date;
}

export class WorkExpDto {
    @IsString()
    work_place: string;

    @IsString()
    job: string;

    @IsDate()
    @Type(() => Date)
    start_at: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    end_at?: Date;
}

export class ContactInfoDto {
    @IsString()
    @IsUrl()
    website: string;

    @IsString()
    @IsUrl()
    linkedin: string;

    @IsString()
    @IsUrl()
    twitter: string; 
}


export class CreateProfileDto {

    @IsString()
    fname: string;

    @IsString()
    lname: string;

    @IsString()
    bio: string;

    @IsString()
    title: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EducationDto)
    education?: EducationDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkExpDto)
    work_exp?: WorkExpDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContactInfoDto)
    contact_info?: ContactInfoDto[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @MaxLength(30, { each: true }) 
    skills?: string[];

    @IsString()
    profile_img: string;
}