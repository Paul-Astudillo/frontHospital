import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  paciente: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.llenarFormularioConDatosAleatorios()
  }
  llenarFormularioConDatosAleatorios() {
    this.paciente = {
      nombre: 'John Doe',
      id: '123456',
      fechaNacimiento: '01/01/1980',
      genero: 'Masculino',
      edad:44,
      direccion: '123 Calle Principal',
      celular: '0999252488',
      correo: 'john.doe@example.com',
      diagnostico: 'Diagnóstico aleatorio',
      alergias: 'Ninguna'
    };
  }
}
