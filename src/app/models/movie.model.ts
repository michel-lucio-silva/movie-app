export interface Movie {
    id: number;
    title: string;
    year: number;
    winner: boolean;
    studios: string[];  // Atualizado para ser um array de strings
    producers: string[];
  }
  
  export interface YearWinners {
    year: number;
    count: number;
  }
  
  export interface StudioWins {
    studio: string;
    wins: number;
  }
  
  export interface ProducerInterval {
    producer: string;
    interval: number;
    previousWin: number;
    followwingWin: number;
  }
  