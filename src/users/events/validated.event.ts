import { User } from '../user.schema';

export class ValidatedUserEvent {
  constructor(public user: User) {}
}
