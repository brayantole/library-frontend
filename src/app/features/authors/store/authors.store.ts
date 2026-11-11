import { Injectable, inject } from '@angular/core';
import { EntityStore } from '../../../core/store/entity.store';
import { Author, CreateAuthorDto, UpdateAuthorDto } from '../models/author';
import { AuthorService } from '../services/author.service';

@Injectable({ providedIn: 'root' })
export class AuthorsStore extends EntityStore<Author, CreateAuthorDto, UpdateAuthorDto> {
  constructor() {
    super(inject(AuthorService));
  }
}
