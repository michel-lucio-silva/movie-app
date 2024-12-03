import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { YearWinners, StudioWins, ProducerInterval, Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private baseUrl = 'https://challenge.outsera.tech/api/movies';

  constructor(private http: HttpClient) {}

  // Método para buscar anos com múltiplos vencedores
  getYearsWithMultipleWinners(): Observable<{ years: YearWinners[] }> {
    return this.http.get<{ years: YearWinners[] }>(`${this.baseUrl}?projection=years-with-multiple-winners`);
  }

  // Método para buscar estúdios com contagem de vitórias
  getStudiosWithWinCount(): Observable<{ studios: StudioWins[] }> {
    return this.http.get<{ studios: StudioWins[] }>(`${this.baseUrl}?projection=studios-with-win-count`);
  }

  // Método para buscar intervalos de vitórias dos produtores
  getProducersInterval(): Observable<{ min: ProducerInterval[]; max: ProducerInterval[] }> {
    return this.http.get<{ min: ProducerInterval[]; max: ProducerInterval[] }>(`${this.baseUrl}?projection=max-min-win-interval-for-producers`);
  }

  // Método para buscar filmes com paginação e filtros de vencedor e ano
  getMovies(page: number, size: number, winner: boolean = true, year?: number): Observable<{ content: Movie[]; totalElements: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('winner', winner.toString()); // Filtrar somente vencedores

    if (year) {
      params = params.set('year', year.toString()); // Filtrar por ano
    }

    return this.http.get<{ content: Movie[]; totalElements: number }>(this.baseUrl, { params });
  }
}
