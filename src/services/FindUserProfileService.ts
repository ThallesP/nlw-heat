import { prisma } from "../prisma";

export class FindUserProfileService {
  async execute(user_id: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });

    return user;
  }
}
