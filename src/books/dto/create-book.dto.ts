import { ApiProperty } from '@nestjs/swagger'

export class CreateBookDto {
  @ApiProperty({ example: 'Война и мир', description: 'Название книги' })
  readonly title: string
  @ApiProperty({ example: 85, description: 'Цена' })
  readonly price: number
}

export class GetBooksQueryDto {
  @ApiProperty({ example: 1, description: 'Номер страницы в пагинации' })
  page?: number
  @ApiProperty({ example: 10, description: 'Кол-во документов на странице' })
  pageCount?: number
}
