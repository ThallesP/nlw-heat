import { Request, Response } from "express";
import { FindUserProfileService } from "../services/FindUserProfileService";

export class FindUserProfileController {
  async handle(request: Request, response: Response) {
    const findProfileUserService = new FindUserProfileService();

    const result = await findProfileUserService.execute(request.user_id);

    return response.json(result);
  }
}
