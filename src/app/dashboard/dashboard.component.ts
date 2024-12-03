import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { YearWinners, StudioWins, ProducerInterval, Movie } from '../models/movie.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  yearsWithMultipleWinners: YearWinners[] = [];
  studiosWithWinCount: StudioWins[] = [];
  producersMinInterval: ProducerInterval[] = [];
  producersMaxInterval: ProducerInterval[] = [];
  moviesByYear: Movie[] = [];
  availableYears: number[] = [];
  selectedYear: number | null = null;
  isValidYear: boolean = true; // Flag para controle da validade do ano

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Carregar os outros dados
    this.moviesService.getMovies(0, 100, true).subscribe((data) => {
      const yearsWithWinners = new Set(data.content.map((movie) => movie.year));
      this.availableYears = Array.from(yearsWithWinners).sort((a, b) => b - a); // Ordenar anos de forma decrescente
    });
  
    // Carregar anos com múltiplos vencedores
    this.moviesService.getYearsWithMultipleWinners().subscribe((data) => {
      this.yearsWithMultipleWinners = data.years;
    });
  
    // Carregar os 3 principais estúdios
    this.moviesService.getStudiosWithWinCount().subscribe((data) => {
      this.studiosWithWinCount = data.studios.slice(0, 3); // Top 3
    });
  
    // Carregar intervalos de produtores
    this.moviesService.getProducersInterval().subscribe((data) => {
      this.producersMinInterval = data.min;
      this.producersMaxInterval = data.max;
    });
  }
  
  validateYear(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const yearValue = parseInt(inputElement.value, 10);
  
    if (yearValue && !isNaN(yearValue) && yearValue > 0 && yearValue <= new Date().getFullYear()) {
      this.isValidYear = true;
      this.selectedYear = yearValue;
      this.searchMoviesByYear(); // Chama a busca de filmes com o ano válido
    } else {
      this.isValidYear = false;
      this.moviesByYear = []; // Limpa a lista de filmes
    }
  }
  
  
  // Buscar filmes vencedores por ano
  searchMoviesByYear(): void {
    if (this.selectedYear && this.isValidYear) {
      this.moviesService.getMovies(0, 10, true, this.selectedYear).subscribe((data) => {
        this.moviesByYear = data.content; // Filtra pelos filmes do ano selecionado
      });
    } else {
      this.moviesByYear = []; // Se não houver ano selecionado ou inválido, limpa a lista de filmes
    }
  }
}
