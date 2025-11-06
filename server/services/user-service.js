import bcrypt from "bcrypt";
import tokenService from "./token-service.js";
import UserDto from "../dtos/user-dto.js";
import ApiError from "../exceptions/api-error.js";
import prisma from "../prisma/prisma-client.js";

class UserService {
  async registration(name, email, password) {
    let candidate = await prisma.user.findUnique({ where: { name } });
    if (candidate) {
      throw ApiError.BadRequest("This name is already in use");
    }
    candidate = await prisma.user.findUnique({ where: { email } });
    if (candidate) {
      throw ApiError.BadRequest("This email is already in use");
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const user = await prisma.user.create({
      data: { name, email, password: hashPassword, role: "USER" },
    });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async login(name, email, password) {
    const user = await prisma.user.findUnique({ where: { name } });
    if (!user) {
      throw ApiError.BadRequest("No user with this name was found");
    }

    if (user.email !== email) {
      throw ApiError.BadRequest("Incorrect name or email");
    }

    if (user.isBlocked) {
      throw ApiError.BadRequest("This user is blocked");
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Incorrect password");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async loginOAuth(user) {
    if (user.isBlocked) {
      throw ApiError.BadRequest("This user is blocked");
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await prisma.user.findUnique({ where: { id: userData.id } });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async getById(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw ApiError.BadRequest("User not found");
    }
    return new UserDto(user);
  }

  async getUsers({ search = "", skip = 0, take = 20, sortBy = "name" }) {
    const queryOptions = {
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      orderBy: {
        [sortBy === "email" ? "email" : "name"]: "asc",
      },
    };
  
    const users = await prisma.user.findMany({
      ...queryOptions,
      skip: Number(skip),
      take: Number(take),
    });

    const usersDto = users.map(user => new UserDto(user));
  
    return usersDto;
  }

  async delete(id) {
    try {
      await prisma.user.delete({
        where: { id },
      });
    } catch (e) {
      throw ApiError.BadRequest("User not found");
    }
  }

  async block(id) {
    try {
      await prisma.user.update({
        where: { id },
        data: { isBlocked: true },
      });
    } catch (e) {
      throw ApiError.BadRequest("User not found");
    }
  }

  async unlock(id) {
    try {
      await prisma.user.update({
        where: { id },
        data: { isBlocked: false },
      });
    } catch (e) {
      throw ApiError.BadRequest("User not found");
    }
  }

  async changeRole(id, role = "USER") {
    const roles = ["USER", "ADMIN"];

    if (!roles.includes(role)) {
      throw ApiError.NotFound(`Role ${role} not found`);
    }

    try {
      const user = await prisma.user.update({
        where: { id },
        data: { role },
      });
      return user;
    } catch (e) {
      throw ApiError.BadRequest("User not found");
    }
  }

  async getUserInventories({ userId, search = "", skip = 0, take = 20 }) {
    const searchFilter = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};
  
    const inventories = await prisma.inventory.findMany({
      where: {
        creatorId: userId,
        ...searchFilter,
      },
      skip: Number(skip),
      take: Number(take),
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  
    return inventories.map(inv => ({
      id: inv.id,
      title: inv.title,
      description: inv.description,
      imageUrl: inv.imageUrl,
      categoryName: inv.category.name,
    }));
  }

  async getUserEditableInventories({ userId, search = "", skip = 0, take = 20 }) {
    const searchFilter = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const inventories = await prisma.inventory.findMany({
      where: {
        editors: {
          some: {
            userId: userId,
          },
        },
        ...searchFilter,
      },
      skip: Number(skip),
      take: Number(take),
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        creator: {
          select: { name: true },
        },
        _count: {
          select: { items: true },
        },
      },
    });

    const inventoriesData = inventories.map(inv => ({
      id: inv.id,
      title: inv.title,
      description: inv.description,
      imageUrl: inv.imageUrl,
      creatorName: inv.creator.name
    }));

    return inventoriesData;
  }
}

const userService = new UserService();
export default userService;

