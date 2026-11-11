import { Injectable, inject } from '@angular/core';
import { EntityStore } from '../../../core/store/entity.store';
import { CreateGenreDto, Genre, UpdateGenreDto } from '../models/genre';
import { GenreService } from '../services/genre.service';

@Injectable({ providedIn: 'root' })
export class GenresStore extends EntityStore<Genre, CreateGenreDto, UpdateGenreDto> {
  constructor() {
    super(inject(GenreService));
  }
}
