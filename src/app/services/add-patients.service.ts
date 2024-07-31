import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddPatientsService {

 
  private apiUrl = 'http://localhost:8000/api/crear-paciente/';

  constructor(private http: HttpClient) {}

  crearPaciente(paciente: any): Observable<any> {
    return this.http.post(this.apiUrl, paciente);
  }
}
