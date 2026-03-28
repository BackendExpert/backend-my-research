import { Body, Controller, Headers, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RequestOTPDTO } from "./dto/request-otp.dto";
import { ClientInfoDecorator } from "src/common/decorators/client-info.decorator";
import type { ClientInfo } from "src/common/interfaces/client-info.interface";
import { VerifyOTPDTO } from "./dto/verify-otp.dto";

@Controller('api/auth')

export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('reqeust-otp')
    requestOTP(
        @Body() dto: RequestOTPDTO,
        @ClientInfoDecorator() client: ClientInfo
    ) {
        return this.authService.RequestOTP(
            dto.email,
            client.ipAddress,
            client.userAgent
        )
    }

    @Post('verify-otp')
    verifyOTP(
        @Body() dto: VerifyOTPDTO,
        @Headers('authorization') authHeader: string,
        @ClientInfoDecorator() client: ClientInfo
    ) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException("Invalid or missing token");
        }

        const token = authHeader.split(' ')[1];

        return this.authService.VerifyOTP(
            token,
            dto.otp,
            client.ipAddress,
            client.userAgent
        )
    }
}