export type FieldState = "NONE" | "NOT_VISIBLE" | "VISIBLE";

export interface IInventory {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  creatorId: string;
  categoryId: string;
  customIdTypeId: string;
  isPublic: boolean;
  version: number;

  customFields: ICustomFields;

  createdAt: string;
  updatedAt: string;
}

export interface ICustomField<T> {
  key: string;
  name?: string | null;
  description?: string | null;
  order?: number | null;
  state: FieldState;
}

export interface ICustomFields {
  string: ICustomField<string>[];
  text: ICustomField<string>[];
  int: ICustomField<number>[];
  link: ICustomField<string>[];
  bool: ICustomField<boolean>[];
}
