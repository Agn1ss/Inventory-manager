import userService from "../services/user-service.js";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation Error", errors.array()));
      }
      const { name, email, password } = req.body;
      const userData = await userService.registration(name, email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      }); // 30d
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      let userData;

      if (req.user) {
        userData = await userService.loginOAuth(req.user);
      } else {
        const { name, email, password } = req.body;
        userData = await userService.login(name, email, password);
      }

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async loginOAuth(req, res, next) {
    try {
      const userData = await userService.loginOAuth(req.user);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      const frontendUrl = process.env.FRONTEND_URL;
      res.redirect(frontendUrl);
    } catch (err) {
      console.error(err);
      res.redirect("/api/oauth/failed");
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const { search = "", skip = 0, take = 20, sortBy = "name" } = req.query;

      const users = await userService.getUsers({
        search,
        skip: Number(skip),
        take: Number(take),
        sortBy,
      });

      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await userService.delete(id);
      return res.json({ message: `User ${id} deleted successfully` });
    } catch (e) {
      next(e);
    }
  }

  async block(req, res, next) {
    try {
      const { id } = req.params;
      await userService.block(id);
      return res.json({ message: `User ${id} blocked successfully` });
    } catch (e) {
      next(e);
    }
  }

  async unlock(req, res, next) {
    try {
      const { id } = req.params;
      await userService.unlock(id);
      return res.json({ message: `User ${id} unblocked successfully` });
    } catch (e) {
      next(e);
    }
  }

  async changeRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      await userService.changeRole(id, role);

      return res.json({ message: `Role of user ${id} changed to ${role}` });
    } catch (e) {
      next(e);
    }
  }

  async getUserInventories(req, res, next) {
    try {
      const userId = req.user.id;
      const { search = "", skip = 0, take = 20 } = req.query;

      const inventories = await userService.getUserInventories({
        userId,
        search,
        skip: Number(skip),
        take: Number(take),
      });

      return res.json(inventories);
    } catch (e) {
      next(e);
    }
  }

  async getUserEditableInventories(req, res, next) {
    try {
      const userId = req.user.id;
      const { search = "", skip = 0, take = 20 } = req.query;

      const inventories = await userService.getUserEditableInventories({
        userId,
        search,
        skip: Number(skip),
        take: Number(take),
      });

      return res.json(inventories);
    } catch (e) {
      next(e);
    }
  }
}

const userController = new UserController();
export default userController;
