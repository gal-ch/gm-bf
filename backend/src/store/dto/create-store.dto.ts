export class CreateStoreDto {
    name: string;
    manager: string;
    address: string;
    day: string;
    hour: string;
    description?: string;
    status: boolean
    closingDay: string;
  }