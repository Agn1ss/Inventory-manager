export interface IItem {
  id: string;
  inventoryId: string;
  creatorId: string;
  creatorName: string;
  customId?: string | null;
  version: number;
  customFields: IItemCustomFields;
  likesCount: number;
}


export interface IItemCustomField<T> {
  key: string;
  value: T | null | undefined;
}

export interface IItemCustomFields {
  string: IItemCustomField<string>[];
  text: IItemCustomField<string>[];
  int: IItemCustomField<number>[];
  link: IItemCustomField<string>[];
  bool: IItemCustomField<boolean>[];
}