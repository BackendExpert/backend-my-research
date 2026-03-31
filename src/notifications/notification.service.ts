import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Notification, NotificationDocument } from "./schema/notification.schema";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { User, UserDocument } from "src/user/schema/user.schema";
import { AuditLog, AuditLogDocument } from "src/auditlogs/schema/auditlog.schema";
import { createAuditLog } from "src/common/utils/auditlogs.util";

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name, 'local')
        private notificationModel: Model<NotificationDocument>,

        @InjectModel(User.name, 'local')
        private userModel: Model<UserDocument>,

        @InjectModel(AuditLog.name, 'local')
        private auditlogModel: Model<AuditLogDocument>,

        private jwtService: JwtService,
    ) { }

    async ReadNotification(
        token: string,
        notifiacitonid: string,
        ipAddress?: string,
        userAgent?: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.user })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const checknotification = await this.notificationModel.findById(notifiacitonid)

        if (!checknotification) {
            await createAuditLog(this.auditlogModel, {
                user: user._id,
                action: "NOTIFICATION_NOT_FOUND",
                description: `User ${user.email} try to access known Notification`,
                ipAddress,
                userAgent,
                metadata: { ipAddress, userAgent }
            });

            throw new NotFoundException("Notification Not Found")
        }

        // ownership check
        if (checknotification.user.toString() !== user._id.toString()) {
            throw new ForbiddenException("You cannot access this notification");
        }

        checknotification.isRead === true
        await checknotification.save()

        return {
            success: true,
            message: "Notification Read Success"
        }

    }



}