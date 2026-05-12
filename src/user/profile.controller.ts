import { BadRequestException, Body, Controller, Get, Headers, Param, Patch, Post, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guard/permissions.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { imageUploadOptions } from "src/common/middleware/image-upload.middleware";
import { Permissions } from "src/common/decorators/permissions.decorator";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ClientInfoDecorator } from "src/common/decorators/client-info.decorator";
import type { ClientInfo } from "src/common/interfaces/client-info.interface";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { CreateEducationDTO } from "./dto/education-create.dto";
import { CreateContactInfoDTO } from "./dto/create-contactinfo.dto";
import { CreateWorkExpDto } from "./dto/create-work.dto";

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


    @Patch('update-profile/:id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @UseInterceptors(FileInterceptor('profile-img', imageUploadOptions))
    @Permissions('update:profile')

    UpdateProfile(
        @Body() dto: UpdateProfileDto,
        @Param('id') id: string,
        @Headers("authorization") authHeader: string,
        @UploadedFile() file: Express.Multer.File,
        @ClientInfoDecorator() client: ClientInfo,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.profileService.UpdateProfile(
            token,
            id,
            dto,
            file?.filename,
            client.ipAddress,
            client.userAgent
        )
    }

    @Post('create-education')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('create:education')

    CreateEducation(
        @Body() dto: CreateEducationDTO,
        @Headers("authorization") authHeader: string,
        @ClientInfoDecorator() client: ClientInfo,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.profileService.CreateEducation(
            token,
            dto,
            client.ipAddress,
            client.userAgent
        )
    }

    @Post('create-contacts')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('create:contact-info')

    CreateContactInfo(
        @Body() dto: CreateContactInfoDTO,
        @Headers("authorization") authHeader: string,
        @ClientInfoDecorator() client: ClientInfo,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.profileService.ContactInfo(
            token,
            dto,
            client.ipAddress,
            client.userAgent
        )
    }

    @Post('create-workexp')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('create:workexp')

    CreateWorkExp(
        @Body() dto: CreateWorkExpDto,
        @Headers("authorization") authHeader: string,
        @ClientInfoDecorator() client: ClientInfo,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.profileService.CreateWorkExp(
            token,
            dto,
            client.ipAddress,
            client.userAgent
        )
    }

    @Patch('update-skills')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('update:skills')

    UpdateSkills(
        @Body('skills') skills: string[],
        @Headers("authorization") authHeader: string,
        @ClientInfoDecorator() client: ClientInfo,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.profileService.UpdateSkills(
            token,
            skills,
            client.ipAddress,
            client.userAgent
        )
    }

    @Post('following')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('create:follow')

    createFollow(
        @Body('memberId') memberid: string,
        @Headers("authorization") authHeader: string,
        @ClientInfoDecorator() client: ClientInfo,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.profileService.FollowMember(
            token,
            memberid,
            client.ipAddress,
            client.userAgent
        )
    }

    
    @Get('my-profile')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('get:profile')

    fetchMyProfile (
        @Headers("authorization") authHeader: string,
    ) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(" ")[1];

        return this.profileService.GetProfileData(token)
    }
}