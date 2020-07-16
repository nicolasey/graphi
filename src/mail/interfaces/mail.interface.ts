export interface MailInterface {
  to: string;
  from?: string;
  template: string;
  subject: string;
  context?: JSON;
}
