import { Router } from "express";
import inventoryController from "../controllers/inventory-controller.js";
import categoryController from "../controllers/category-controller.js";
import tagController from "../controllers/tag-controller.js";
import commentController from "../controllers/comment-controller.js";
import itemController from "../controllers/item-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import inventoryAccessMiddleware from "../middlewares/inventory-access-middleware.js";

const inventoryRouter = Router();

inventoryRouter.get("/categories", categoryController.getCategories);
inventoryRouter.get("/inventories", inventoryController.searchInventories);
inventoryRouter.get("/inventories/popular", inventoryController.getMostPopularInventories);
inventoryRouter.get("/tags", tagController.getTags);
inventoryRouter.get("/tags/:id", tagController.getOne);
inventoryRouter.get("/tags/:id/inventories", tagController.getInventoriesByTag);
inventoryRouter.post("/create", authMiddleware, inventoryController.create);

inventoryRouter.post(
  "/:id/update",
  authMiddleware,
  inventoryAccessMiddleware({ allowEditors: false }),
  inventoryController.update
);

inventoryRouter.get(
  "/:id",
  inventoryController.getInventoryData
);

inventoryRouter.get("/:id/tags", tagController.getInventoryTags);

inventoryRouter.get(
  "/:id/editors",
  inventoryController.getInventoryEditors
);

inventoryRouter.post(
  "/delete-many",
  authMiddleware,
  inventoryController.deleteMany
);

inventoryRouter.get("/:id/comments", authMiddleware, commentController.getComments);
inventoryRouter.post("/:id/comments/create", authMiddleware, commentController.createComment);

inventoryRouter.get(
  "/:id/items",
  itemController.getItems
);

inventoryRouter.post(
  "/:id/items/create",
  authMiddleware,
  inventoryAccessMiddleware({ allowEditors: true }),
  itemController.create
);

inventoryRouter.post(
  "/:id/items/:itemId/update",
  authMiddleware,
  inventoryAccessMiddleware({ allowEditors: true }),
  itemController.update
);

inventoryRouter.post(
  "/:id/items/delete-many",
  authMiddleware,
  inventoryAccessMiddleware({ allowEditors: true }),
  itemController.deleteMany
);

inventoryRouter.patch("/:id/items/:itemId/like", authMiddleware, itemController.like);
inventoryRouter.post(
  "/:id/items/:itemId/delete",
  authMiddleware,
  inventoryAccessMiddleware({ allowEditors: true }),
  itemController.delete
);

inventoryRouter.get(
  "/:id/items/:itemId",
  authMiddleware,
  inventoryAccessMiddleware({ allowEditors: true }),
  itemController.getOne
);

export default inventoryRouter;
