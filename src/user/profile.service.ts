import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { Model } from "mongoose";
import { Profile, ProfileDocument } from "./schema/profile.schema";
import { AuditLog, AuditLogDocument } from "src/auditlogs/schema/auditlog.schema";
import { JwtService } from "@nestjs/jwt";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { createAuditLog } from "src/common/utils/auditlogs.util";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { CreateEducationDTO } from "./dto/education-create.dto";

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(User.name, 'local')
        private userModel: Model<UserDocument>,

        @InjectModel(Profile.name, 'local')
        private profileModel: Model<ProfileDocument>,

        @InjectModel(AuditLog.name, 'local')
        private auditlogModel: Model<AuditLogDocument>,

        private readonly jwtService: JwtService,
    ) { }

    async CreateProfile(
        token: string,
        dto: CreateProfileDto,
        profileImgFile: string,
        ipAddress?: string,
        userAgent?: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.user })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const checkProfile = await this.profileModel.findOne({ user: user._id })

        if (checkProfile) {
            await createAuditLog(this.auditlogModel, {
                user: user._id,
                action: "PROFILE_ALREADY_CREATED",
                description: `User ${user.email} Candidate Profile Already Created`,
                ipAddress,
                userAgent,
                metadata: { ipAddress, userAgent }
            });

            throw new ConflictException("Profile Already Created")
        }


        const profile = new this.profileModel({
            user: user._id,
            fname: dto.fname,
            lname: dto.lname,
            bio: dto.bio,
            title: dto.title,
            profile_img: `/uploads/profile/${profileImgFile}`,
        });

        const savedProfile = await profile.save();

        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "PROFILE_CREATED",
            description: `User ${user.email} created a new profile`,
            ipAddress,
            userAgent,
            metadata: { profileId: savedProfile._id, ipAddress, userAgent }
        });

        return {
            success: true,
            message: "Profile Created Success"
        }
    }

    async UpdateProfile(
        token: string,
        id: string,
        dto: UpdateProfileDto,
        profileImgFile?: string,
        ipAddress?: string,
        userAgent?: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.user })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const checkProfile = await this.profileModel.findOne({ user: user._id })

        if (!checkProfile) {
            await createAuditLog(this.auditlogModel, {
                user: user._id,
                action: "NO_PROFILE_TO_UPDATE",
                description: `User ${user.email} try to update unknown Profile`,
                ipAddress,
                userAgent,
                metadata: { ipAddress, userAgent }
            });

            throw new NotFoundException("Profile Cannot Found")
        }

        const updateData: any = {}

        if (dto.fname !== undefined)
            updateData.fname = dto.fname

        if (dto.lname !== undefined)
            updateData.lname = dto.lname

        if (dto.bio !== undefined)
            updateData.bio = dto.bio

        if (profileImgFile) {
            updateData.profile_img = `/uploads/cv/${profileImgFile}`
        }

        const updatedProfile = await this.profileModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )


        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "PROFILE_UPDATED",
            description: `User Profile ${user.email} Updated`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent }
        });

        return {
            success: true,
            message: "Profile Updated Success"
        }

    }


    async CreateEducation(
        token: string,
        dto: CreateEducationDTO,
        ipAddress?: string,
        userAgent?: string
    ) {
        const payload = await this.jwtService.verify(token)
        const user = await this.userModel.findOne({ email: payload.user })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const checkprofile = await this.profileModel.findOne({ user: user._id })

        if (!checkprofile) {
            throw new NotFoundException("Profile cannot Found")
        }

        checkprofile.education.push({
            institute_name: dto.institute_name,
            course: dto.course,
            start_at: dto.start_at,
            end_at: dto.end_at
        });

        await checkprofile.save()

        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "EDUCATION_UPDATED",
            description: `User Profile ${user.email} Create New Education`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent }
        });

        return {
            success: true,
            message: "New Education Created Success"
        }


    }

}