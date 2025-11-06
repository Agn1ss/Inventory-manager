import prisma from "../prisma/prisma-client.js";
import filterKeysByCondition from "../utils/filterKeysByCondition.js";
import ApiError from "../exceptions/api-error.js";
import dayjs from "dayjs";
import { DATE_FORMAT_TYPES, RANDOM_TYPES } from "../utils/data.js";

class CustomIdTypeService {
  async create() {
    const customIdType = await prisma.customIdType.create({
      data: {},
    });
    return customIdType;
  }

  async update(id, updateData) {
    const fields = [
      ["fixedText", updateData.fixedText, () => true],
      ["randomType", updateData.randomType, () => true],
      ["dateFormat", updateData.dateFormat, () => true],
      ["sequenceName", updateData.sequenceName, () => true],
    ];

    const data = filterKeysByCondition(fields);

    data.isTypeNotEmpty = fields.some(([, value]) => !!value );

    const updatedType = await prisma.customIdType.update({
      where: { id },
      data,
    });

    return updatedType;
  }

  async getOne(id) {
    const customIdType = await prisma.customIdType.findUnique({
      where: { id },
    });

    if (!customIdType) {
      throw ApiError.BadRequest(`CustomIdType with id "${id}" not found`);
    }

    return customIdType;
  }

  async generateId(typeId, date = new Date()) {
    const type = await prisma.customIdType.findUnique({ where: { id: typeId } });
    if (!type) throw new Error(`CustomIdType with id "${typeId}" not found`);
  
    const dayjsDate = dayjs(date);
    const parts = [];
  
    if (type.fixedText) parts.push(type.fixedText);
    if (type.randomType) parts.push(RANDOM_TYPES[type.randomType]());
    if (type.dateFormat) parts.push(DATE_FORMAT_TYPES[type.dateFormat](dayjsDate));
    if (type.sequenceName) {
      const seq = String(type.sequenceCounter).padStart(4, "0");
      parts.push(seq);
  
      await prisma.customIdType.update({
        where: { id: typeId },
        data: { sequenceCounter: { increment: 1 } },
      });
    }
  
    return parts.filter(Boolean).join("-");
  }
}

const customIdTypeService = new CustomIdTypeService();
export default customIdTypeService;
