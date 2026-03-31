import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Notification, NotificationSchema } from "./schema/notification.schema";
import { NotificationService } from "./notification.service";
import { AuthModule } from "src/auth/auth.module";
import { User, UserSchema } from "src/user/schema/user.schema";
import { RoleModule } from "src/role/role.module";
import { NotificationController } from "./notification.controller";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guard/permissions.guard";
import { AuditLog, AuditLogSchema } from "src/auditlogs/schema/auditlog.schema";

@Module({
    imports: [
        AuthModule,
        RoleModule,
        MongooseModule.forFeature([
            { name: Notification.name, schema: NotificationSchema },
            { name: User.name, schema: UserSchema },
            { name: AuditLog.name, schema: AuditLogSchema }
        ], 'local')
    ],
    controllers: [NotificationController],
    providers: [
        NotificationService,
        JwtAuthGuard,
        PermissionsGuard
    ],
    exports: [NotificationService]
})

export class NotificationModule { }