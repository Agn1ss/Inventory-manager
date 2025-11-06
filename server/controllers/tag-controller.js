import tagService from "../services/tag-service.js";


class TagController {
  async getTags(req, res, next) {
    try {
      const { search = "", limit = 8,isSearch = false } = req.query;
      const tags = await tagService.getTags({
        search,
        limit: Number(limit),
        isSearch: isSearch === "true"
      });
  
      return res.json(tags);
    } catch (e) {
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const id = req.params.id;
      const tag = await tagService.getOne(id);
  
      return res.json(tag);
    } catch (e) {
      next(e);
    }
  }

  async getInventoryTags(req, res, next) {
    try {
      const { id } = req.params;
      const tags = await tagService.getInventoryTags(id);
      return res.json(tags);
    } catch (e) {
      next(e);
    }
  }

  async getInventoriesByTag(req, res, next) {
    try {
      const { id } = req.params;
      const { skip = 0, take = 20 } = req.query;
  
      const inventories = await tagService.getInventoriesByTag({
        id,
        skip: Number(skip),
        take: Number(take),
      });
  
      return res.json(inventories);
    } catch (e) {
      next(e);
    }
  }


}


const tagController = new TagController();
export default tagController;