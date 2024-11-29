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
  moviesByYear: Movie[] = []; // Filmes filtrados pelo ano selecionado
  availableYears: number[] = []; // Lista de anos disponíveis para o combo
  selectedYear: number | null = null; // Ano selecionado

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Carregar anos com múltiplos vencedores
    this.moviesService.getYearsWithMultipleWinners().subscribe((data) => {
      this.yearsWithMultipleWinners = data.years;
      this.availableYears = data.years.map((year) => year.year); // Extrai os anos para o combo
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

  // Buscar filmes vencedores por ano
  searchMoviesByYear(): void {
    if (this.selectedYear) {
      this.moviesService.getMovies(0, 10, true, this.selectedYear).subscribe((data) => {
        this.moviesByYear = data.content;
      });
    } else {
      this.moviesByYear = []; // Reseta a lista caso nenhum ano seja selecionado
    }
  }
}
