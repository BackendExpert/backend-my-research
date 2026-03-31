import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
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
import { CreateContactInfoDTO } from "./dto/create-contactinfo.dto";
import { CreateWorkExpDto } from "./dto/create-work.dto";
import { CreateNotification } from "src/common/utils/notification.util";
import { Notification, NotificationDocument } from "src/notifications/schema/notification.schema";



@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(User.name, 'local')
        private userModel: Model<UserDocument>,

        @InjectModel(Profile.name, 'local')
        private profileModel: Model<ProfileDocument>,

        @InjectModel(AuditLog.name, 'local')
        private auditlogModel: Model<AuditLogDocument>,

        @InjectModel(Notification.name, 'local')
        private notificationModel: Model<NotificationDocument>,

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
            city: dto.city,
            country: dto.country,
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

    async ContactInfo(
        token: string,
        dto: CreateContactInfoDTO,
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

        if (checkprofile.contact_info) {
            throw new BadRequestException("Contact info already exists. Use update.");
        }

        checkprofile.contact_info = {
            website: dto.website,
            linkedin: dto.linkedin,
            twitter: dto.twitter
        };

        await checkprofile.save()

        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "CONTACT_INFO_CREATED",
            description: `User Profile ${user.email} Create Contact Info`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent }
        });

        return {
            success: true,
            message: "Contact Info Created Success"
        }

    }

    async CreateWorkExp(
        token: string,
        dto: CreateWorkExpDto,
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

        checkprofile.work_exp.push({
            work_place: dto.work_place,
            job: dto.job,
            city: dto.city,
            country: dto.country,
            start_at: dto.start_at,
            end_at: dto.end_at
        });

        await checkprofile.save()

        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "WORK_EXP_ADDED",
            description: `User Profile ${user.email} Work Exp added Success`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent }
        });

        return {
            success: true,
            message: "Work Exp Added Success"
        }

    }

    async UpdateSkills(
        token: string,
        skills: string[],
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

        checkprofile.skills = skills

        await checkprofile.save()

        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "SKILLS_UPDATED",
            description: `User Profile ${user.email} Skills Updated Success`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent }
        });

        return {
            success: true,
            message: "Skills Updated Success"
        }
    }

    async FollowMember(
        token: string,
        memberid: string,
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

        const targetUser = await this.userModel.findById(memberid)
        if (!targetUser) {
            throw new NotFoundException("Target User Not Found")
        }

        const targetProfile = await this.profileModel.findOne({ user: targetUser._id })
        if (!targetProfile) {
            throw new NotFoundException("Target Profile Not Found")
        }

        // prevent self-follwing

        if (user._id.toString() === targetUser._id.toString()) {
            throw new BadRequestException("You cannot follow yourself")
        }

        // already following

        const alreadyFollowing = checkprofile.followings.includes(targetUser._id)
        if (alreadyFollowing) {
            throw new BadRequestException("Already following this user")
        }

        checkprofile.followings.push(targetUser._id)

        targetProfile.followers.push(user._id)

        await checkprofile.save()
        await targetProfile.save()

        await CreateNotification(this.notificationModel, {
            user: user._id,
            title: `You started following ${targetProfile.fname} ${targetProfile.lname}`,
            message: `You are now following ${targetProfile.fname} ${targetProfile.lname}`,
            type: "follow",
            refId: targetProfile._id,
            refModel: "Profile",
        });

        await CreateNotification(this.notificationModel, {
            user: targetUser._id,
            title: `${checkprofile.fname} ${checkprofile.lname} started following you`,
            message: `${checkprofile.fname} ${checkprofile.lname} is now following you`,
            type: "follow",
            refId: checkprofile._id,
            refModel: "Profile",
        });

        return {
            succes: true,
            message: "Followed Success"
        }

    }


}