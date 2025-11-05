import inventoryService from "../services/inventory-service.js";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";

class InventoryController {
  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation Error", errors.array()));
      }
      const creatorId = req.user.id;
      const inventoryData = await inventoryService.create(creatorId);
      return res.json(inventoryData);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const inventoryData = {
        ...req.body.inventory,
        tags: req.body.tags,
        category: req.body.category,
        customIdType: req.body.customIdType,
      };
      const updatedInventoryData = await inventoryService.update(id, inventoryData);

      return res.json(updatedInventoryData);
    } catch (e) {
      next(e);
    }
  }

  async getInventoryData(req, res, next) {
    try {
      const id = req.params.id;
      const inventoryData = await inventoryService.getInventory(id);

      if (!inventoryData) {
        return next(ApiError.NotFound("Inventory not found"));
      }

      return res.json(inventoryData);
    } catch (e) {
      next(e);
    }
  }

  async deleteMany(req, res, next) {
    try {
      const { ids } = req.body;

      await inventoryService.deleteMany(ids);
      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  async getInventoryEditors(req, res, next) {
    try {
      const id = req.params.id;
      const { search = "", skip = 0, take = 20, sortBy = "name" } = req.query;

      const editors = await inventoryService.getInventoryEditors({
        inventoryId: id,
        search,
        skip: Number(skip),
        take: Number(take),
        sortBy,
      });

      return res.json(editors);
    } catch (e) {
      next(e);
    }
  }

  async searchInventories(req, res, next) {
    try {
      const { search = "", skip = 0, limit = 5, newest = false } = req.query;

      const inventoriesData = await inventoryService.searchInventories({
        search,
        skip: Number(skip),
        take: Number(limit),
        newest: newest === "true" || newest === true,
      });

      return res.json(inventoriesData);
    } catch (e) {
      next(e);
    }
  }

  async getMostPopularInventories(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const inventoriesData = await inventoryService.getMostPopularInventories(limit);

      return res.json(inventoriesData);
    } catch (e) {
      next(e);
    }
  }
}

const inventoryController = new InventoryController();
export default inventoryController;
