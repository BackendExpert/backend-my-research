import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { RoleModule } from "src/role/role.module";
import { User, UserSchema } from "./schema/user.schema";
import { Profile, ProfileSchema } from "./schema/profile.schema";
import { AuditLog, AuditLogSchema } from "src/auditlogs/schema/auditlog.schema";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guard/permissions.guard";
import { Notification, NotificationSchema } from "src/notifications/schema/notification.schema";


@Module({
    imports: [
        RoleModule,
        AuthModule,
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema },
            {name: Profile.name, schema: ProfileSchema },
            {name: AuditLog.name, schema: AuditLogSchema },
            {name: Notification.name, schema: NotificationSchema },
        ], 'local')
    ],
    controllers: [ProfileController],
    providers: [
        ProfileService,
        JwtAuthGuard,
        PermissionsGuard
    ],
    exports: [ProfileService]
})

export class ProfileModule { }