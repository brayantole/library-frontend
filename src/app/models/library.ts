export interface Autor {
  _id?: string;
  name: string;
  nationality: string;
  birthYear?: number;
}

export interface Genero {
  _id?: string;
  name: string;
  description?: string;
}

export interface Libro {
  _id?: string;
  title: string;
  isbn: string;
  authorId?: string;
  genreIds?: string[];
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
