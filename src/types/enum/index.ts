export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum Warranty {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

export enum OperatingSystem {
  "Windows 10" = "Windows 10",
  "Windows 11" = "Windows 11",
}

export enum TransactionType {
  TRANSFER = "TRANSFER",
  REPAIR = "REPAIR",
  MAINTENANCE = "MAINTENANCE",
  RETURN = "RETURN",
  DONATION = "DONATION",
  DISPOSAL = "DISPOSAL",
  LOST = "LOST",
  OTHER = "OTHER",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum TransactionDirection {
  OUTGOING = "OUTGOING",
  INCOMING = "INCOMING",
}
