import { MailerModule, MailerService } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from "./mail.service";
@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            },
            defaults: {
                from: '"No Reply" <support@hany.com>',
            },
            template: {
                dir: __dirname + '/templates',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            }

        })
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}