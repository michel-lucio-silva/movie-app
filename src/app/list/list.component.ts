import { Component, OnInit, ViewChild } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { Movie } from '../models/movie.model';
import { ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  movies: Movie[] = [];
  totalMovies: number = 0;
  page: number = 0;  // Página inicial
  size: number = 10;
  selectedYear: number | undefined = undefined;
  selectedWinner: boolean | undefined = undefined;
  displayedColumns: string[] = ['title', 'year', 'studios', 'winner']; 
  years: number[] = []; 
  isLargeScreen: boolean = true;

  constructor(private moviesService: MoviesService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadYears();
  }

  loadMovies(): void {
    this.moviesService.getMovies(this.page, this.size, this.selectedWinner, this.selectedYear).subscribe((data) => {
      this.movies = data.content;
      this.totalMovies = data.totalElements;  // Total de filmes após o filtro

      // Atualiza a página se necessário
      const totalPages = Math.ceil(this.totalMovies / this.size);
      if (this.page >= totalPages) {
        this.page = totalPages - 1;  // Ajusta para a última página válida
      }

      // Atualiza o paginator
      if (this.paginator) {
        this.paginator.pageIndex = this.page;
        this.paginator.length = this.totalMovies;
      }

      this.cdRef.detectChanges();  // Força a detecção de mudanças
    });
  }

  loadYears(): void {
    this.moviesService.getMovies(0, 1000).subscribe((data) => {
      const yearsSet = new Set(data.content.map((movie: Movie) => movie.year));
      this.years = Array.from(yearsSet).sort((a, b) => b - a); 
    });
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
    this.page = 0;  // Resetar para a primeira página
    this.loadMovies();  // Recarrega os filmes com a nova página
  }

  onWinnerChange(winner: boolean | undefined): void {
    this.selectedWinner = winner;
    this.page = 0;  // Resetar para a primeira página
    this.loadMovies();  // Recarrega os filmes com a nova página
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex;  // Atualiza o índice da página
    this.size = event.pageSize;   // Atualiza o tamanho da página
    this.loadMovies();            // Recarrega os filmes com a nova página e tamanho
  }
}
