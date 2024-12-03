import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MoviesService } from '../services/movies.service';
import { of } from 'rxjs';
import { MatSelectModule } from '@angular/material/select'; 
import { MatFormFieldModule } from '@angular/material/form-field';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockMoviesService: jasmine.SpyObj<MoviesService>;

  beforeEach(() => {
    // Criando o mock para MoviesService
    mockMoviesService = jasmine.createSpyObj('MoviesService', ['getMovies']);
    
    // Inicializando o módulo de teste
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports: [ 
        MatSelectModule,       
        MatFormFieldModule      
      ],
      providers: [
        { provide: MoviesService, useValue: mockMoviesService }
      ]
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadData on ngOnInit', () => {
    spyOn(component, 'loadData');  
    component.ngOnInit();  
    expect(component.loadData).toHaveBeenCalled(); 
  });

});
