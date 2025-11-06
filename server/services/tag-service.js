import prisma from "../prisma/prisma-client.js";
import ApiError from "../exceptions/api-error.js";

class TagService {
  async getTags({ search = "", limit = 8, isSearch = false }) {
    const where =
      !search.trim() && !isSearch
        ? {}
        : {
            name: {
              startsWith: search,
              mode: "insensitive",
            },
          };

    const tags = await prisma.tag.findMany({
      where,
      take: limit,
      select: {
        id: true,
        name: true,
      },
    });

    return tags;
  }

  async getInventoryTags(inventoryId) {
    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
      select: {
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!inventory) {
      throw new ApiError.NotFound(`Inventory ${inventoryId} not found`);
    }

    return inventory.tags;
  }

  async setInventoryTags(tags, inventoryId, tx) {
    if (!tags || tags.length === 0 || !tx) {
      return { success: false };
    }

    const existingTags = await tx.tag.findMany({
      where: { name: { in: tags } },
    });

    const existingTagNames = existingTags.map(t => t.name);
    const newTagNames = tags.filter(name => !existingTagNames.includes(name));

    if (newTagNames.length > 0) {
      await tx.tag.createMany({
        data: newTagNames.map(name => ({ name })),
        skipDuplicates: true,
      });
    }

    const targetTags = await tx.tag.findMany({
      where: { name: { in: tags } },
      select: { id: true },
    });

    await tx.inventory.update({
      where: { id: inventoryId },
      data: {
        tags: {
          set: targetTags.map(tag => ({ id: tag.id })),
        },
      },
    });

    return { success: true };
  }

  async getOne(id) {
    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new ApiError.NotFound(`tag ${id} not founded`);
    }
    return tag;
  }

  async getInventoriesByTag({ id, skip = 0, take = 20 }) {
    const inventories = await prisma.inventory.findMany({
      where: {
        tags: {
          some: {
            id: id,
          },
        },
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
      },
    });

    return inventories.map(inv => ({
      id: inv.id,
      title: inv.title,
      description: inv.description,
      imageUrl: inv.imageUrl,
      creatorName: inv.creator.name,
    }));
  }
}

const tagService = new TagService();
export default tagService;
