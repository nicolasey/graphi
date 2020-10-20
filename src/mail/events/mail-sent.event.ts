import { MailInterface } from '../interfaces/mail.interface'

export class MailSentEvent {
    constructor(public mail: MailInterface) {}
}