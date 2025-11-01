export default class InventoryDto {
  constructor(inventory) {
    this.id = inventory.id;
    this.title = inventory.title;
    this.description = inventory.description;
    this.imageUrl = inventory.imageUrl;
    this.creatorId = inventory.creatorId;
    this.categoryId = inventory.categoryId;
    this.customIdTypeId = inventory.customIdTypeId;
    this.isPublic = inventory.isPublic;
    this.version = inventory.version;
    this.createdAt = inventory.createdAt;
    this.updatedAt = inventory.updatedAt;

    this.customFields = {
      string: [
        {
          key: "customString1",
          name: inventory.customString1Name,
          description: inventory.customString1Description,
          order: inventory.customString1Order,
          state: inventory.customString1State,
        },
        {
          key: "customString2",
          name: inventory.customString2Name,
          description: inventory.customString2Description,
          order: inventory.customString2Order,
          state: inventory.customString2State,
        },
        {
          key: "customString3",
          name: inventory.customString3Name,
          description: inventory.customString3Description,
          order: inventory.customString3Order,
          state: inventory.customString3State,
        },
      ],
      text: [
        {
          key: "customText1",
          name: inventory.customText1Name,
          description: inventory.customText1Description,
          order: inventory.customText1Order,
          state: inventory.customText1State,
        },
        {
          key: "customText2",
          name: inventory.customText2Name,
          description: inventory.customText2Description,
          order: inventory.customText2Order,
          state: inventory.customText2State,
        },
        {
          key: "customText3",
          name: inventory.customText3Name,
          description: inventory.customText3Description,
          order: inventory.customText3Order,
          state: inventory.customText3State,
        },
      ],
      int: [
        {
          key: "customInt1",
          name: inventory.customInt1Name,
          description: inventory.customInt1Description,
          order: inventory.customInt1Order,
          state: inventory.customInt1State,
        },
        {
          key: "customInt2",
          name: inventory.customInt2Name,
          description: inventory.customInt2Description,
          order: inventory.customInt2Order,
          state: inventory.customInt2State,
        },
        {
          key: "customInt3",
          name: inventory.customInt3Name,
          description: inventory.customInt3Description,
          order: inventory.customInt3Order,
          state: inventory.customInt3State,
        },
      ],
      link: [
        {
          key: "customLink1",
          name: inventory.customLink1Name,
          description: inventory.customLink1Description,
          order: inventory.customLink1Order,
          state: inventory.customLink1State,
        },
        {
          key: "customLink2",
          name: inventory.customLink2Name,
          description: inventory.customLink2Description,
          order: inventory.customLink2Order,
          state: inventory.customLink2State,
        },
        {
          key: "customLink3",
          name: inventory.customLink3Name,
          description: inventory.customLink3Description,
          order: inventory.customLink3Order,
          state: inventory.customLink3State,
        },
      ],
      bool: [
        {
          key: "customBool1",
          name: inventory.customBool1Name,
          description: inventory.customBool1Description,
          order: inventory.customBool1Order,
          state: inventory.customBool1State,
        },
        {
          key: "customBool2",
          name: inventory.customBool2Name,
          description: inventory.customBool2Description,
          order: inventory.customBool2Order,
          state: inventory.customBool2State,
        },
        {
          key: "customBool3",
          name: inventory.customBool3Name,
          description: inventory.customBool3Description,
          order: inventory.customBool3Order,
          state: inventory.customBool3State,
        },
      ],
    };
  }
}
