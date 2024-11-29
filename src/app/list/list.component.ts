import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { Movie } from '../models/movie.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  movies: Movie[] = [];
  totalMovies: number = 0;
  page: number = 0;
  size: number = 10;
  selectedYear: number | undefined = undefined;
  selectedWinner: boolean | undefined = undefined;
  displayedColumns: string[] = ['title', 'year', 'studios', 'winner']; 
  years: number[] = []; // Lista de anos disponíveis para filtro
  isLargeScreen: boolean = true;
  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadYears();
  }

  loadMovies(): void {
    this.moviesService.getMovies(this.page, this.size, this.selectedWinner, this.selectedYear).subscribe((data) => {
      this.movies = data.content;
      this.totalMovies = data.totalElements;
    });
  }

  loadYears(): void {
    this.moviesService.getMovies(0, 1000).subscribe((data) => {
      const yearsSet = new Set(data.content.map((movie: Movie) => movie.year));
      this.years = Array.from(yearsSet).sort((a, b) => b - a); // Ordena os anos de forma decrescente
    });
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
    this.loadMovies();
  }

  onWinnerChange(winner: boolean | undefined): void {
    this.selectedWinner = winner;
    this.loadMovies();
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadMovies();
  }
}
