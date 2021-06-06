import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Movie } from 'src/shared/models/movie.model';

@Component({
  selector: 'app-movie-editor',
  templateUrl: './movie-editor.component.html',
  styleUrls: ['./movie-editor.component.css']
})
export class MovieEditorComponent implements OnInit {
  movieForm = new FormGroup({
    Genre: new FormControl(null, [Validators.required, this.alphabetValidation.bind(this)]),
    Director: new FormControl(null, [Validators.required, this.alphabetValidation.bind(this)]),
    Year: new FormControl(null, [Validators.required, this.yearValidation.bind(this)]),
    Title: new FormControl(null, [Validators.required, this.movieExistInArray.bind(this), this.charValidation.bind(this)]),
    Poster: new FormControl(null,)
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { movie: Movie, movies: Movie[], index: number },
    private dialog: MatDialogRef<any>) { }

  ngOnInit(): void {
    if (this.data.movie instanceof Object) {
      this.movieForm.get('Genre')?.patchValue((this.data.movie).Genre);
      this.movieForm.get('Director')?.patchValue((this.data.movie).Director);
      this.movieForm.get('Title')?.patchValue((this.data.movie).Title);
      this.movieForm.get('Year')?.patchValue((this.data.movie).Year);
      this.movieForm.get('Poster')?.patchValue((this.data.movie).Poster);
    }
  }

  onSave(): void {
    const values = this.movieForm.getRawValue();
    this.dialog.close(values);
  }

  onClose(): void {
    this.dialog.close();
  }

  movieExistInArray(control: FormControl): { [s: string]: boolean } | null {
    if (this.data.movies instanceof Array) {
      const foundMovieByTitle = (this.data.movies).filter((movie, index) => index !== this.data.index && movie.Title === control.value);
      if (foundMovieByTitle.length) {
        return { 'titleExists': true }
      }
    }
    return null;
  }

  charValidation(control: FormControl): { [s: string]: boolean } | null {
    var regex = /^[a-zA-Z,0-9, ' ',':','!','?']+$/;
    if (!regex.test(control.value)) {
      return { 'invalidChar': true }
    }
    return null;
  }

  yearValidation(control: FormControl): { [s: string]: boolean } | null {
    var regex = /^[0-9]+$/;
    if (!regex.test(control.value)) {
      return { 'invalidChar': true }
    }
    else if (control.value < 1900 || control.value > 2030) {
      return { 'invalidYear': true }
    }
    return null;
  }

  alphabetValidation(control: FormControl): { [s: string]: boolean } | null {
    var regex = /^[a-zA-Z,' ',',',-]+$/;
    if (!regex.test(control.value)) {
      console.log("wrong alphabet")
      return { 'invalidChar': true }
    }
    return null;
  }

  validateErrorMessage(errorMessage: any, item: any): boolean {
    return !!this.movieForm?.get(item?.formControlName)?.hasError(errorMessage.message);
  }
}
