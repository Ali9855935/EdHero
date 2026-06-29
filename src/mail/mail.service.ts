import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    sendMail() {
        throw new Error('Method not implemented.');
    }
    constructor(private readonly mailer: MailerService) { }

    async sendEnrollmentMail(email: string, studentName: string, courseName: string) {
        try {
            await this.mailer.sendMail({
                to: email,
                subject: `Your Seat Is Booked For ${courseName}`,
                template: 'enrollment',
                context: {
                    studentName,
                    courseName,
                },
            });
            // console.log('Enrollment email sent successfully');
        } catch (error) {
            console.error('Failed to send enrollment email:', error);
        }
    }
}
