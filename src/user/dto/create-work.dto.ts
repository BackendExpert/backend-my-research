import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class CreateWorkExpDto {
    @IsString()
    work_place: string;

    @IsString()
    job: string;

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