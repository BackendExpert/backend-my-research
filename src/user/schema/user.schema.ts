import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ unique: true, required: true })
    email: string;

    @Prop()
    phone: string;

    @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
    role: Types.ObjectId;
    
    @Prop({ required: true, default: new Date() })
    last_login: Date

    @Prop({ default: true })
    isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);