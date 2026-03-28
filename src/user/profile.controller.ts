import { BadRequestException, Body, Controller, Headers, Post, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guard/permissions.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { imageUploadOptions } from "src/common/middleware/image-upload.middleware";
import { Permissions } from "src/common/decorators/permissions.decorator";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ClientInfoDecorator } from "src/common/decorators/client-info.decorator";
import type { ClientInfo } from "src/common/interfaces/client-info.interface";

@Controller('api/profile')

export class ProfileController {
    constructor(
        private readonly profileService: ProfileService
    ) { }

    @Post('create-profile')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @UseInterceptors(FileInterceptor('profile-img', imageUploadOptions))
    @Permissions('create:profile')

    CreateProfile(
        @Body() dto: CreateProfileDto,
        @Headers("authorization") authHeader: string,
        @UploadedFile() file: Express.Multer.File,
        @ClientInfoDecorator() client: ClientInfo,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        if (!file) {
            throw new BadRequestException("Profile Image file is required");
        }

        const token = authHeader.split(" ")[1];

        return this.profileService.CreateProfile(
            token,
            dto,
            file.filename,
            client.ipAddress,
            client.userAgent
        )

    }
}