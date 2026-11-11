export interface Genre {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGenreDto {
  name: string;
  description?: string;
}

export type UpdateGenreDto = Partial<CreateGenreDto>;
