import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Notification, NotificationSchema } from "./schema/notification.schema";
import { NotificationService } from "./notification.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: Notification.name, schema: NotificationSchema },
        ], 'local')
    ],

    providers: [NotificationService],
    exports: [NotificationService]
})

export class NotificationModule { }