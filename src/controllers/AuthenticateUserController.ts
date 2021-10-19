import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService";

export class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    const { code } = request.body;

    const authenticateUserService = new AuthenticateUserService();

    try {
      const result = await authenticateUserService.execute(code);
      return response.json(result);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
