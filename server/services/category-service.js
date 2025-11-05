import ApiError from "../exceptions/api-error.js";
import prisma from "../prisma/prisma-client.js";

class CategoryService {
  async getCategories({ search, limit = 8 }) {
    if (!search || search.trim() === "") return [];

    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      take: limit,
      select: {
        id: true,
        name: true,
      },
    });

    return categories;
  }

  async getOne(id) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new ApiError.NotFound(`Category ${id} not founded`);
    }
    return category;
  }
}

const categoryService = new CategoryService();
export default categoryService;
