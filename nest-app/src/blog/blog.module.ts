import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';
import { BullModule } from '@nestjs/bullmq';
import { BlogConsumer } from './blog-publish-mail.consumer';
import { UploaderModule } from 'src/uploader/uploader.module';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    BullModule.registerQueue({
      name: 'blog-publish-mail',
    }),
    UploaderModule,
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogConsumer],
})
export class BlogModule {}
