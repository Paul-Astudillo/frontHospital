import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { ReportComponent } from './pages/report/report.component';
import { Hl7FormComponent } from './pages/hl7-form/hl7-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'doctors', component: DoctorsComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'report', component: ReportComponent },
  { path: 'hl7-form', component: Hl7FormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
