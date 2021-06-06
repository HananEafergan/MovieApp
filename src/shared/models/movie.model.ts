export interface Movie {
    id: number;
    Title: string;
    Year: number;
    Runtime: number;
    Genre: string[];
    Director: string;
    Poster: string;
}

export interface SearchDTO {
    Search: Id[]
}

export interface Id {
    imdbID: string;
}
