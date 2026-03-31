import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Notification, NotificationDocument } from "./schema/notification.schema";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class NotificationService {
    constructor (
        @InjectModel(Notification.name, 'local')
        private notificationModel: Model<NotificationDocument>,

        private jwtService: JwtService,
    ) {}

}