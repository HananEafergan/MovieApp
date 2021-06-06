import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

import { Movie, SearchDTO } from '../shared/models/movie.model';
import { MatDialog } from '@angular/material/dialog';
import { MovieEditorComponent } from './movie-editor/movie-editor.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MovieApp';
  movies: Movie[] = [];

  constructor(private httpClient: HttpClient,
    private dialog: MatDialog) {
    this.initMoviesArray();
  }

  public addMovie(): void {
    this.openMovieDialog(MovieEditorComponent, { movies: this.movies, movie: null, index: null }, (data: any) => {
      if (data) {
        this.movies = [data, ...this.movies];
      }
    }, { width: '900px', height: '500px' });
  }

  public editMovie(movie: Movie, index: number): void {
    this.openMovieDialog(MovieEditorComponent, { movie, index, movies: this.movies }, (data: any) => {
      if (data) {
        const movieToUpdate = this.movies[index];
        this.movies[index] = {
          ...movieToUpdate,
          ...data,
        };
      }
    }, { width: '900px', height: '500px' });
  }

  public deleteMovie(i: number): void {
    this.openMovieDialog(ConfirmDialogComponent, null, (data: any) => {
      switch (data) {
        case 'confirm':
          this.movies = this.movies.filter((m, j) => j !== i);
          break;
        case 'cancel':
          break;
      }
    }, { width: 'auto', height: 'auto' });
  }

  private openMovieDialog(component: any, data: any, cb: Function, dimentions: { width: string, height: string }): void {
    this.dialog.open(component, {
      data,
      width: dimentions.width,
      height: dimentions.height,
    }).afterClosed().pipe(
      take(1),
    ).subscribe(data => {
      cb(data);
    });
  }

  private initMoviesArray(): void {
    this.httpClient.get("http://www.omdbapi.com/?s=test&apikey=19d641c0").subscribe(data => {
      const result = data as SearchDTO;
      result.Search.forEach(element => {
        this.httpClient.get(`http://www.omdbapi.com/?i=${element.imdbID}&apikey=19d641c0`).subscribe(data => this.movies.push(data as Movie))
      });
    });
  }
}
