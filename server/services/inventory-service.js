import prisma from "../prisma/prisma-client.js";
import customIdTypeController from "./custom-id-type-service.js";
import filterKeysByCondition from "../utils/filterKeysByCondition.js";
import InventoryDto from "../dtos/inventory-dto.js";
import tagService from "./tag-service.js";
import ApiError from "../exceptions/api-error.js";

class InventoryService {
  async create(creatorId) {
    let category = await prisma.category.findUnique({
      where: { name: "various" },
    });
    if (!category) {
      category = await prisma.category.create({
        data: { name: "various" },
      });
    }
    const customIdType = await customIdTypeController.create();
    const inventory = await prisma.inventory.create({
      data: {
        title: "New Inventory",
        description: "",
        creator: {
          connect: { id: creatorId },
        },
        customIdType: {
          connect: { id: customIdType.id },
        },
        category: {
          connect: { id: category.id },
        },
      },
    });

    const inventoryDto = new InventoryDto(inventory);

    return {
      inventory: inventoryDto,
      tags: [],
      category: "various",
      customIdType: customIdType,
    };
  }

  async update(inventoryId, inventoryData) {
    return await prisma.$transaction(
      async tx => {
        const existingInventory = await tx.inventory.findUnique({
          where: { id: inventoryId },
          select: { id: true, version: true, customIdTypeId: true },
        });
  
        if (!existingInventory) {
          throw ApiError.BadRequest(`Inventory with id "${inventoryId}" not found`);
        }
  
        if (existingInventory.version !== inventoryData.version) {
          throw ApiError.BadRequest(
            `Inventory was updated by someone else. Expected version ${inventoryData.version}, but found ${existingInventory.version}`
          );
        }
  
        const customIdType = await customIdTypeController.update(
          existingInventory.customIdTypeId,
          inventoryData.customIdType
        );
  
        let categoryName = inventoryData.categoryName ?? "various";
  
        let category = await tx.category.findUnique({
          where: { name: categoryName },
        });
        if (!category) {
          category = await tx.category.create({ data: { name: categoryName } });
        }
  
        const fields = [
          ["title", inventoryData.title, () => true],
          ["description", inventoryData.description, () => true],
          ["imageUrl", inventoryData.imageUrl, () => true],
          ["categoryId", category.id, () => true],
          ["customIdTypeId", customIdType.id, () => true],
          ["isPublic", inventoryData.isPublic, () => true],
        ];
  
        if (inventoryData.customFields) {
          const types = ["string", "text", "int", "link", "bool"];
          types.forEach(type => {
            inventoryData.customFields[type]?.forEach((field, index) => {
              const prefix = `custom${type.charAt(0).toUpperCase() + type.slice(1)}${index + 1}`;
              fields.push([`${prefix}State`, field.state, () => true]);
              if (field.name !== "NONE") {
                fields.push([`${prefix}Name`, field.name, () => true]);
                fields.push([`${prefix}Description`, field.description, () => true]);
                fields.push([`${prefix}Order`, field.order, () => true]);
              }
            });
          });
        }
  
        const data = filterKeysByCondition(fields);
  
        const inventory = await tx.inventory.update({
          where: { id: inventoryId },
          data: { ...data, version: { increment: 1 } },
        });
  
        let tags = [];
        const tagResult = await tagService.setInventoryTags(inventoryData.tags, inventory.id, tx);
        if (tagResult.success) {
          tags = inventoryData.tags;
        }
  
        if (inventoryData.editorsId) {
          await inventoryService.setInventoryEditors(inventory.id, inventoryData.editorsId, tx);
        }
  
        const inventoryDto = new InventoryDto(inventory);
  
        return {
          inventory: inventoryDto,
          tags: tags,
          category: categoryName,
          customIdType: customIdType,
        };
      },
      { timeout: 15000 }
    );
  }
  

  async getInventory(id) {
    const inventory = await prisma.inventory.findUnique({
      where: { id },
      include: {
        tags: { select: { name: true } },
        category: { select: { name: true } },
        customIdType: {
          select: {
            id: true,
            fixedText: true,
            isTypeNotEmpty: true,
            randomType: true,
            dateFormat: true,
            sequenceName: true,
            sequenceCounter: true,
          },
        },
      },
    });

    if (!inventory) return null;

    const inventoryDto = new InventoryDto(inventory);

    return {
      inventory: inventoryDto,
      tags: inventory.tags.map(t => t.name),
      category: inventory.category?.name || null,
      customIdType: inventory.customIdType,
    };
  }

  async setInventoryEditors(inventoryId, newEditorIds, tx) {
    if (!tx) {
      throw ApiError.BadRequest(
        `Update inventory editors error. Inventory was updated by someone else.`
      );
    }

    await tx.inventoryEditor.deleteMany({
      where: {
        inventoryId,
        userId: { notIn: newEditorIds },
      },
    });

    if (newEditorIds.length > 0) {
      await tx.inventoryEditor.createMany({
        data: newEditorIds.map(userId => ({ inventoryId, userId })),
        skipDuplicates: true,
      });
    }
  }

  async getInventoryEditors({ inventoryId, search = "", skip = 0, take = 20, sortBy = "name" }) {
    const searchFilter = search
      ? {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        }
      : {};
  
    const queryOptions = {
      where: {
        inventoryId,
        ...searchFilter,
      },
      skip: Number(skip),
      orderBy: {
        user: {
          [sortBy === "email" ? "email" : "name"]: "asc",
        },
      },
      select: {
        user: true,
      },
    };
  
    if (Number(take) > 0) {
      queryOptions.take = Number(take);
    }
  
    const editors = await prisma.inventoryEditor.findMany(queryOptions);
    return editors.map(e => e.user);
  }

  async searchInventories({ search = "", skip = 0, take = 5, newest = false }) {
    const queryOptions = {
      ...(search
        ? {
            where: {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            },
          }
        : {}),
      ...(newest ? { orderBy: { createdAt: "desc" } } : {}),
    };

    const inventories = await prisma.inventory.findMany({
      ...queryOptions,
      skip: Number(skip),
      take: Number(take),
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        creator: {
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
      creatorName: inv.creator.name,
    }));
  }

  async getMostPopularInventories(limit = 5) {
    const inventories = await prisma.inventory.findMany({
      take: limit,
      orderBy: {
        items: { _count: "desc" },
      },
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

const inventoryService = new InventoryService();
export default inventoryService;
