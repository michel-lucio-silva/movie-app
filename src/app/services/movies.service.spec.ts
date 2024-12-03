import { TestBed } from '@angular/core/testing';
import { MoviesService } from './movies.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // Importações para mockar o HttpClient
import { HttpClientModule } from '@angular/common/http';  // Caso precise em outros testes

describe('MoviesService', () => {
  let service: MoviesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Usando HttpClientTestingModule
      providers: [MoviesService],          // O serviço será injetado aqui
    });
    service = TestBed.inject(MoviesService);
    httpMock = TestBed.inject(HttpTestingController);  // Simula as requisições HTTP
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();  // Verifica se todas as requisições foram feitas
  });
});
