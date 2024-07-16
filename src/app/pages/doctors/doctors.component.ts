import { Component } from '@angular/core';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent {
  doctors = [
    { name: 'Dr. Smith', specialty: 'Cardiología', phone: '123-456-7890' },
    { name: 'Dr. Johnson', specialty: 'Neurología', phone: '987-654-3210' }
  ];

  addDoctor() {
    // Lógica para agregar un nuevo doctor
  }

  editDoctor(doctor: any) {
    // Lógica para editar un doctor existente
  }

  deleteDoctor(doctor: any) {
    // Lógica para eliminar un doctor
  }

}
