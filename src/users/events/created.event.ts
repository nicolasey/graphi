import { User } from '../user.schema';

export class UserCreatedEvent {
  constructor(public user: User) {}
}
