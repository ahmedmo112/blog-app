import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "src/auth/entities/user.entity";

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendPublishingConfirmation(user:User , postTitle: string) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: "Post published",
            template: "./confirmation",
            context: {
                name: user.name,
                title: postTitle
            }
        })
    }
}