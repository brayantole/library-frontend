import { Injectable } from '@angular/core';
import { ApiService } from '../core/api/api.service';
import { CreateGenreDto, Genre, UpdateGenreDto } from '../features/genres/models/genre';

@Injectable({ providedIn: 'root' })
export class GenreService extends ApiService<Genre, CreateGenreDto, UpdateGenreDto> {
  protected readonly resource = 'genres';

  getGenres() { return this.getAll(); }
  createGenre(genre: CreateGenreDto) { return this.create(genre); }
  deleteGenre(id: string) { return this.delete(id); }
}
