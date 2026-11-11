export interface Author {
  _id: string;
  name: string;
  nationality: string;
  birthYear?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuthorDto {
  name: string;
  nationality: string;
  birthYear?: number;
}

export type UpdateAuthorDto = Partial<CreateAuthorDto>;
