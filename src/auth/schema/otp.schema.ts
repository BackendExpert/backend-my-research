import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type OTPDocument = OTP & Document

@Schema({ timestamps: true })

export class OTP {
    @Prop({ unique: true, required: true })
    email!: string;

    @Prop({ required: true })
    otp!: string;

    @Prop({ required: true })
    expireAt!: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);