import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/api/api.service';
import { Author, CreateAuthorDto, UpdateAuthorDto } from '../models/author';

@Injectable({ providedIn: 'root' })
export class AuthorService extends ApiService<Author, CreateAuthorDto, UpdateAuthorDto> {
  protected readonly resource = 'authors';
}
