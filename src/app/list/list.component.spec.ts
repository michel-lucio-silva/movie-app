import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { MoviesService } from '../services/movies.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Movie } from '../models/movie.model';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let moviesService: jasmine.SpyObj<MoviesService>;

  beforeEach(async () => {
    const moviesServiceSpy = jasmine.createSpyObj('MoviesService', ['getMovies']);

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        HttpClientTestingModule,
        MatTableModule,
        MatPaginatorModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: MoviesService, useValue: moviesServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    moviesService = TestBed.inject(MoviesService) as jasmine.SpyObj<MoviesService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load movies and years on initialization', () => {
      const mockMovies = {
        content: [
          { id: 1, title: 'Movie A', year: 2020, winner: true, producers: [], studios: [] },
          { id: 2, title: 'Movie B', year: 2021, winner: false, producers: [], studios: [] },
        ],
        totalElements: 2,
      };

      moviesService.getMovies.and.returnValue(of(mockMovies));

      component.ngOnInit();

      expect(moviesService.getMovies).toHaveBeenCalledTimes(2); 
      expect(component.movies).toEqual(mockMovies.content);
      expect(component.totalMovies).toEqual(mockMovies.totalElements);
      expect(component.years).toEqual([2021, 2020]);
    });
  });

  describe('loadMovies', () => {
    it('should load movies with filters applied', () => {
      const mockMovies = {
        content: [
          { id: 1, title: 'Movie A', year: 2020, winner: true, producers: [], studios: [] },
          { id: 2, title: 'Movie B', year: 2020, winner: false, producers: [], studios: [] },
        ],
        totalElements: 2,
      };

      component.page = 1;
      component.size = 5;
      component.selectedYear = 2020;
      component.selectedWinner = true;

      moviesService.getMovies.and.returnValue(of(mockMovies));

      component.loadMovies();

      expect(moviesService.getMovies).toHaveBeenCalledWith(1, 5, true, 2020);
      expect(component.movies).toEqual(mockMovies.content);
      expect(component.totalMovies).toEqual(mockMovies.totalElements);
    });
  });

  describe('loadYears', () => {
    it('should load unique years from movies', () => {
      const mockMovies = {
        content: [
          { id: 1, title: 'Movie A', year: 2020, winner: true, producers: [], studios: [] },
          { id: 2, title: 'Movie B', year: 2021, winner: false, producers: [], studios: [] },
        ],
        totalElements: 2,
      };

      moviesService.getMovies.and.returnValue(of(mockMovies));

      component.loadYears();

      expect(moviesService.getMovies).toHaveBeenCalledWith(0, 1000);
      expect(component.years).toEqual([2021, 2020]);
    });
  });

  describe('onYearChange', () => {
    it('should update the selected year and reload movies', () => {
      spyOn(component, 'loadMovies');

      component.onYearChange(2020);

      expect(component.selectedYear).toBe(2020);
      expect(component.loadMovies).toHaveBeenCalled();
    });
  });

  describe('onWinnerChange', () => {
    it('should update the selected winner and reload movies', () => {
      spyOn(component, 'loadMovies');

      component.onWinnerChange(true);

      expect(component.selectedWinner).toBe(true);
      expect(component.loadMovies).toHaveBeenCalled();
    });
  });

  describe('onPageChange', () => {
    it('should update pagination and reload movies', () => {
      spyOn(component, 'loadMovies');

      const pageEvent = { pageIndex: 2, pageSize: 20 };
      component.onPageChange(pageEvent);

      expect(component.page).toBe(2);
      expect(component.size).toBe(20);
      expect(component.loadMovies).toHaveBeenCalled();
    });
  });
});
