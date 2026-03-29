import { IsDate, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateEducationDTO {
    @IsString()
    institute_name: string;

    @IsString()
    course: string;

    @IsString()
    city: string;

    @IsString()
    country: string;

    @Type(() => Date)
    @IsDate()
    start_at: Date;

    @Type(() => Date)
    @IsDate()
    end_at: Date;
}