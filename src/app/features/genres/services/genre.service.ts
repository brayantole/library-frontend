import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/api/api.service';
import { CreateGenreDto, Genre, UpdateGenreDto } from '../models/genre';

@Injectable({ providedIn: 'root' })
export class GenreService extends ApiService<Genre, CreateGenreDto, UpdateGenreDto> {
  protected readonly resource = 'genres';
}
