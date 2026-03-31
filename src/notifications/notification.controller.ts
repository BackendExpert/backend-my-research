import { Controller, Headers, Param, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ClientInfoDecorator } from "src/common/decorators/client-info.decorator";
import { Permissions } from "src/common/decorators/permissions.decorator";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guard/permissions.guard";
import type { ClientInfo } from "src/common/interfaces/client-info.interface";
import { NotificationService } from "./notification.service";

@Controller('api/notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) { }

    @Post('read-notification/:id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('read:notification')

    ReadNotification(
        @Param('id') id: string,
        @Headers("authorization") authHeader: string,
        @ClientInfoDecorator() client: ClientInfo,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.notificationService.ReadNotification(
            token,
            id,
            client.ipAddress,
            client.userAgent
        )
    }
}