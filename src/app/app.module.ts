import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'; // Importação necessária
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListComponent } from './list/list.component';

// Importações do Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field'; // Necessário para mat-form-field
import { MatSelectModule } from '@angular/material/select'; // Necessário para mat-select
import { MatOptionModule } from '@angular/material/core'; // Necessário para mat-option
import { MatPaginatorModule } from '@angular/material/paginator'; // Necessário para mat-paginator

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, // Registra o HttpClient para injeção de dependência
    RouterModule.forRoot([
      { path: 'dashboard', component: DashboardComponent },
      { path: 'list', component: ListComponent },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ]),
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule, // Adicionado para mat-form-field
    MatSelectModule, // Adicionado para mat-select
    MatOptionModule, // Adicionado para mat-option
    MatPaginatorModule, // Adicionado para mat-paginator
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
