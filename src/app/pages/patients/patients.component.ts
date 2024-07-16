import { Component } from '@angular/core';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent {
  patients = [
    { name: 'Juan Pérez', age: 30, gender: 'Masculino', phone: '123-456-7890' },
    { name: 'Ana García', age: 25, gender: 'Femenino', phone: '987-654-3210' }
  ];

  addPatient() {
    // Lógica para agregar un nuevo paciente
  }

  editPatient(patient: any) {
    // Lógica para editar un paciente existente
  }

  deletePatient(patient: any) {
    // Lógica para eliminar un paciente
  }

}
