import axios from "axios";
import { sign } from "jsonwebtoken";
import { prisma } from "../prisma";

interface IGithubAccessTokenResponse {
  access_token: string;
  token_type: string;
}

interface IUserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

export class AuthenticateUserService {
  async execute(code: string) {
    const url = "https://github.com/login/oauth/access_token";

    const { data: accessTokenResponse } =
      await axios.post<IGithubAccessTokenResponse>(url, null, {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      });

    const { data: userResponse } = await axios.get<IUserResponse>(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `${accessTokenResponse.token_type} ${accessTokenResponse.access_token}`,
        },
      }
    );

    const { avatar_url, id, login, name } = userResponse;

    let user = await prisma.user.findFirst({
      where: {
        github_id: id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          avatar_url,
          github_id: id,
          login,
          name,
        },
      });
    }

    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d", subject: user.id }
    );

    return { token, user };
  }
}
