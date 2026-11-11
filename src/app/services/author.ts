import { Injectable } from '@angular/core';
import { ApiService } from '../core/api/api.service';
import { Author, CreateAuthorDto, UpdateAuthorDto } from '../features/authors/models/author';

@Injectable({ providedIn: 'root' })
export class AuthorService extends ApiService<Author, CreateAuthorDto, UpdateAuthorDto> {
  protected readonly resource = 'authors';

  getAuthors() { return this.getAll(); }
  createAuthor(author: CreateAuthorDto) { return this.create(author); }
  deleteAuthor(id: string) { return this.delete(id); }
}
