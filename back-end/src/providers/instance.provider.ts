import { UserService } from '@app/user/user.service';

class Singleton {
  private static userInstance: UserService;
  public static getUserInstance(): UserService {
    if (!Singleton.userInstance) {
      Singleton.userInstance = new UserService();
    }
    return Singleton.userInstance;
  }
}

export { Singleton };
