import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MoviesService } from '../services/movies.service';
import { of } from 'rxjs';
import { YearWinners, StudioWins, ProducerInterval, Movie } from '../models/movie.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let moviesService: jasmine.SpyObj<MoviesService>;

  beforeEach(async () => {
    const moviesServiceSpy = jasmine.createSpyObj('MoviesService', [
      'getYearsWithMultipleWinners',
      'getStudiosWithWinCount',
      'getProducersInterval',
      'getMovies',
    ]);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        HttpClientTestingModule,
        MatTableModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: MoviesService, useValue: moviesServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    moviesService = TestBed.inject(MoviesService) as jasmine.SpyObj<MoviesService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('loadData', () => {
    it('should load years with multiple winners and update availableYears', () => {
      const yearsData: { years: YearWinners[] } = {
        years: [
          { year: 2000, count: 2 },
          { year: 2010, count: 3 },
        ],
      };
      moviesService.getYearsWithMultipleWinners.and.returnValue(of(yearsData));

      component.loadData();
      expect(moviesService.getYearsWithMultipleWinners).toHaveBeenCalled();
      expect(component.yearsWithMultipleWinners).toEqual(yearsData.years);
      expect(component.availableYears).toEqual([2000, 2010]);
    });

    it('should load studios with win counts', () => {
      const studiosData: { studios: StudioWins[] } = {
        studios: [
          { studio: 'Studio A', wins: 5 },
          { studio: 'Studio B', wins: 3 },
          { studio: 'Studio C', wins: 2 },
        ],
      };
      moviesService.getStudiosWithWinCount.and.returnValue(of(studiosData));

      component.loadData();
      expect(moviesService.getStudiosWithWinCount).toHaveBeenCalled();
      expect(component.studiosWithWinCount).toEqual(studiosData.studios.slice(0, 3));
    });

    it('should load producers interval data', () => {
      const intervalData: { min: ProducerInterval[]; max: ProducerInterval[] } = {
        min: [
          { producer: 'Producer A', interval: 1, previousWin: 1990, followwingWin: 1991 },
        ],
        max: [
          { producer: 'Producer B', interval: 15, previousWin: 2000, followwingWin: 2015 },
        ],
      };
      moviesService.getProducersInterval.and.returnValue(of(intervalData));

      component.loadData();
      expect(moviesService.getProducersInterval).toHaveBeenCalled();
      expect(component.producersMinInterval).toEqual(intervalData.min);
      expect(component.producersMaxInterval).toEqual(intervalData.max);
    });
  });

  describe('searchMoviesByYear', () => {
    it('should load movies for the selected year', () => {
      const moviesData: { content: Movie[]; totalElements: number } = {
        content: [
          { id: 1, title: 'Movie A', year: 2000, winner: true, producers: ['teste1'], studios: ['studio 1'] },
          { id: 2, title: 'Movie B', year: 2000, winner: true, producers: ['teste2'], studios: ['studio 2'] },
        ],
        totalElements: 2,
      };
      component.selectedYear = 2000;
      moviesService.getMovies.and.returnValue(of(moviesData));

      component.searchMoviesByYear();
      expect(moviesService.getMovies).toHaveBeenCalledWith(0, 10, true, 2000);
      expect(component.moviesByYear).toEqual(moviesData.content);
    });

    it('should reset moviesByYear if no year is selected', () => {
      component.selectedYear = null;

      component.searchMoviesByYear();
      expect(moviesService.getMovies).not.toHaveBeenCalled();
      expect(component.moviesByYear).toEqual([]);
    });
  });

  describe('Template rendering', () => {
    it('should display years with multiple winners', () => {
      const yearsData: YearWinners[] = [
        { year: 2000, count: 2 },
        { year: 2010, count: 3 },
      ];
      component.yearsWithMultipleWinners = yearsData;

      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('table:first-of-type tr');

      expect(rows.length).toBe(3); // Header + 2 rows
      expect(rows[1].textContent).toContain('2000');
      expect(rows[1].textContent).toContain('2');
      expect(rows[2].textContent).toContain('2010');
      expect(rows[2].textContent).toContain('3');
    });

    it('should display top 3 studios with win counts', () => {
      const studiosData: StudioWins[] = [
        { studio: 'Studio A', wins: 5 },
        { studio: 'Studio B', wins: 3 },
        { studio: 'Studio C', wins: 2 },
      ];
      component.studiosWithWinCount = studiosData;

      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('table:nth-of-type(2) tr');

      expect(rows.length).toBe(4); // Header + 3 rows
      expect(rows[1].textContent).toContain('Studio A');
      expect(rows[1].textContent).toContain('5');
      expect(rows[2].textContent).toContain('Studio B');
      expect(rows[2].textContent).toContain('3');
    });
  });
});
