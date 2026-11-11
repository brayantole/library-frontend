import { Author } from '../../authors/models/author';
import { Genre } from '../../genres/models/genre';

export interface Book {
  _id: string;
  title: string;
  isbn: string;
  year?: number;
  available: boolean;
  authorId: string;
  genreIds: string[];
  author: Author | null;
  genres: Genre[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookDto {
  title: string;
  isbn: string;
  authorId: string;
  genreIds: string[];
  year?: number;
}

export type UpdateBookDto = Partial<CreateBookDto>;
