import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/user/schema/user.schema";
import { OTP, OTPDocument } from "./schema/otp.schema";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "src/common/utils/email.util";
import { generateOTP } from "src/common/utils/otp.util";
import bcrypt from 'bcrypt';
import { createAuditLog } from "src/common/utils/auditlogs.util";
import { AuditLog, AuditLogDocument } from "src/auditlogs/schema/auditlog.schema";
import { Role, RoleDocument } from "src/role/schema/role.schema";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name, 'local')
        private userModel: Model<UserDocument>,

        @InjectModel(OTP.name, 'local')
        private otpModel: Model<OTPDocument>,

        @InjectModel(AuditLog.name, 'local')
        private auditLogModel: Model<AuditLogDocument>,

        @InjectModel(Role.name, 'local')
        private roleModel: Model<RoleDocument>,

        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async RequestOTP(email: string, ipAddress?: string, userAgent?: string) {

        // Check existing OTP
        const existingOTP = await this.otpModel.findOne({ email });

        if (existingOTP) {
            throw new ConflictException("OTP already sent, check your email...");
        }

        // Generate OTP
        const otp = generateOTP(8);
        const hashedOTP = await bcrypt.hash(otp, 10);
        const expireOTP = new Date(Date.now() + 5 * 60 * 1000);

        await this.otpModel.create({
            email,
            otp: hashedOTP,
            expireAt: expireOTP,
        });

        // Find user
        let user = await this.userModel.findOne({ email });

        // Get citizen role
        const citizenRole = await this.roleModel.findOne({ role: "researcher" });

        if (!citizenRole) {
            throw new NotFoundException("Citizen role not found");
        }

        let message = "";

        // Register new user if not exists
        if (!user) {
            user = await this.userModel.create({
                email,
                role: citizenRole._id
            });

            message = "Registration successful, OTP sent to email";

            await createAuditLog(this.auditLogModel, {
                user: user._id,
                action: "REGISTER_OTP_SENT",
                description: `Registration OTP sent to ${user.email}`,
                ipAddress,
                userAgent,
                metadata: { ipAddress, userAgent }
            });

        } else {

            message = "Welcome back, OTP sent to email";

            await createAuditLog(this.auditLogModel, {
                user: user._id,
                action: "LOGIN_OTP_SENT",
                description: `Login OTP sent to ${user.email}`,
                ipAddress,
                userAgent,
                metadata: { ipAddress, userAgent }
            });
        }

        // Send OTP email
        await this.emailService.sendOTP(user.email, otp, ipAddress, userAgent);

        // Generate token
        const token = this.jwtService.sign(
            { sub: user._id, email, type: "OTP_TOKEN" },
            { expiresIn: "5m" }
        );

        return {
            success: true,
            message,
            token
        };
    }
    async VerifyOTP(token: string, otp: string, ipAddress?: string, userAgent?: string) {
        const payload = this.jwtService.verify(token);

        if (payload.type !== "OTP_TOKEN") {
            throw new UnauthorizedException("Token type mismatch");
        }

        const otpRecord = await this.otpModel.findOne({ email: payload.email });
        if (!otpRecord) {
            throw new NotFoundException("OTP record not found, try again");
        }

        if (new Date() > otpRecord.expireAt) {
            throw new UnauthorizedException("OTP is Expired");
        }

        const user = await this.userModel
            .findOne({ email: payload.email })
            .populate<{ role: Role }>("role")
            .exec();

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const isOTPValid = await bcrypt.compare(otp, otpRecord.otp);
        if (!isOTPValid) {
            await createAuditLog(this.auditLogModel, {
                user: user._id,
                action: "LOGIN_FAILED - WRONG_OTP",
                description: `Login failed with wrong OTP`,
                ipAddress,
                userAgent,
                metadata: { ipAddress, userAgent }
            });
            throw new UnauthorizedException("OTP does not match");
        }

        user.last_login = new Date();
        await user.save();


        const loginToken = this.jwtService.sign({
            sub: user._id,
            user: user.email,
            role: user.role.role,
            type: "LOGIN_TOKEN"
        });

        await this.emailService.NotificationEmail(user.email, "Login Success", ipAddress, userAgent);
        await this.otpModel.deleteOne({ email: payload.email });

        await createAuditLog(this.auditLogModel, {
            user: user._id,
            action: "LOGIN_SUCCESS",
            description: `User logged in successfully`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent }
        });

        return { success: true, message: "Login successful", token: loginToken };
    }
}