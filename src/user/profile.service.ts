import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { Model } from "mongoose";
import { Profile, ProfileDocument } from "./schema/profile.schema";
import { AuditLog, AuditLogDocument } from "src/auditlogs/schema/auditlog.schema";
import { JwtService } from "@nestjs/jwt";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { createAuditLog } from "src/common/utils/auditlogs.util";


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
            profile_img: profileImgFile,
            education: dto.education || [],
            work_exp: dto.work_exp || [],
            contact_info: dto.contact_info || [],
            skills: dto.skills || []
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
}