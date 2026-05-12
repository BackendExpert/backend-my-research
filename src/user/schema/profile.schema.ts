import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";

@Schema({ _id: true })
export class Education {
    @Prop({ required: true, trim: true })
    institute_name!: string;

    @Prop({ required: true, trim: true })
    course!: string;

    @Prop({ required: true, trim: true })
    city!: string;

    @Prop({ required: true, trim: true })
    country!: string;

    @Prop({ required: true })
    start_at!: Date;

    @Prop()
    end_at!: Date;
}

export const EducationSchema = SchemaFactory.createForClass(Education);

@Schema({ _id: true })
export class WorkExp {
    @Prop({ required: true, trim: true })
    work_place!: string;

    @Prop({ required: true, trim: true })
    job!: string;

    @Prop({ required: true, trim: true })
    city!: string;

    @Prop({ required: true, trim: true })
    country!: string;


    @Prop({ required: true })
    start_at!: Date;

    @Prop()
    end_at!: Date;
}

export const WorkExpSchema = SchemaFactory.createForClass(WorkExp);

@Schema({ _id: false })
export class ContactInfo {
    @Prop({ required: true, trim: true })
    website!: string;

    @Prop({ required: true, trim: true })
    linkedin!: string;

    @Prop({ required: true, trim: true })
    twitter!: string;
}

export const ContactInfoSchema = SchemaFactory.createForClass(ContactInfo);

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user!: Types.ObjectId;

    @Prop({ required: true, trim: true })
    fname!: string;

    @Prop({ required: true, trim: true })
    lname!: string;

    @Prop({ required: true, trim: true })
    bio!: string;

    @Prop({
        type: String,
        enum: [
            'Mr',
            'Ms',
            'Dr',
            'Prof',
            'Assoc. Prof',
            'Asst. Prof',
            'Sr. Prof',
            'Eng'
        ],
        default: "Mr"
    })
    title!: string;

    @Prop({
        type: [EducationSchema],
        default: []
    })
    education!: Education[];

    @Prop({
        type: [WorkExpSchema],
        default: []
    })
    work_exp!: WorkExp[];

    @Prop({
        type: ContactInfoSchema,
        default: null
    })
    contact_info!: ContactInfo;

    @Prop({
        type: [String],
        default: [],
        validate: {
            validator: (val: string[]) => val.length <= 30,
            message: 'Maximum 30 skills allowed'
        }
    })
    skills!: string[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    followers!: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    followings!: Types.ObjectId[];

    @Prop({ required: true })
    profile_img!: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);