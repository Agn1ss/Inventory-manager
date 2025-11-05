type RandomType = "BIT_20" | "BIT_32" | "DIGITS_6" | "DIGITS_9" | "GUID";

type DateFormat = "YYYY" | "YYYYMMDD" | "YYYYMMDDHHmmss" | "YYYY_MM_DD" | "DDMMYYYY";

export interface ICustomIdType {
  id: string;
  fixedText: string | null;
  isTypeNotEmpty: boolean;
  randomType: RandomType | null;
  dateFormat: DateFormat | null;
  sequenceName: boolean;
  sequenceCounter: number;
  createdAt: string;
  updatedAt: string;
}
