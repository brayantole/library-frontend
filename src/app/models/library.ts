export interface Autor {
  _id?: string | { toHexString(): string };
  name: string;
  nationality: string;
  birthYear?: number;
}

export interface Genero {
  _id?: string | { toHexString(): string };
  name: string;
  description?: string;
}

export interface Libro {
  _id?: string | { toHexString(): string };
  title: string;
  isbn: string;
  authorId?: string | { toHexString(): string };
  genreIds?: Array<string | { toHexString(): string }>;
  year?: number;
  available: boolean;
  author?: Autor | null;
  genres?: Genero[];
}

export interface CrearLibro {
  title: string;
  isbn: string;
  authorId: string;
  genreIds: string[];
  year?: number;
}

export interface ApiErrorResponse {
  message?: string;
}
