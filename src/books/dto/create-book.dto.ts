export class CreateBookDto {
  readonly title: string
  readonly price: number
}

export class GetBooksQueryDto {
  page?: number
  pageCount?: number
}
