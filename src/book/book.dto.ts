export interface CreatebookDTO {
  title: string;
  image: string;
  description: string;
  price: number;
}

export type UpdatebookDTO = Partial<CreatebookDTO>;
