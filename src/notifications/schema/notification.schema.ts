import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    user: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    message: string;

    @Prop({ default: false })
    isRead: boolean;

    @Prop({ default: "general" })
    type: string; 

    @Prop({ type: Types.ObjectId, refPath: "refModel", required: false })
    refId?: Types.ObjectId;

    @Prop({ required: false })
    refModel?: string; 
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);