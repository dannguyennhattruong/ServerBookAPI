export interface CreateOrderDTO {
  books: {
    book: string;
    quantity: number;
  }[];
}
