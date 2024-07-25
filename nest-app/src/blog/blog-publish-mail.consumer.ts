import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from 'src/mail/mail.service';

@Processor('blog-publish-mail')
export class BlogConsumer extends WorkerHost {
  constructor(private mailService: MailService) {
    super();
  }
  async process(job: Job): Promise<any> {
    console.log('Sending mail');
    await this.sendMail(job.data);
  }

  async sendMail(data: any) {
    await this.mailService.sendPublishingConfirmation(
      data.user,
      data.postTitle,
    );
  }
}
