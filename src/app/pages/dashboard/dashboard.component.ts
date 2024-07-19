import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  totalPatients = 120;
  totalDoctors = 15;
  recentReports = 8;

  constructor() {}

  ngOnInit(): void {
    this.createPatientsByMonthChart();
    this.createGenderDistributionChart();
  }

  createPatientsByMonthChart() {
    const container = document.getElementById('patientsByMonth');
    if (container) {
      container.innerHTML = `
        <svg viewBox="0 0 100 50" class="w-100">
          <polyline fill="none" stroke="#007bff" stroke-width="2"
            points="0,40 10,30 20,20 30,10 40,20 50,30 60,10 70,30 80,20 90,10 100,40" />
        </svg>
      `;
    }
  }

  createGenderDistributionChart() {
    const container = document.getElementById('genderDistribution');
    if (container) {
      container.innerHTML = `
        <svg viewBox="0 0 32 32" class="w-100">
         <path d="M 16, 0 A 16, 16 0 1, 1 16, 32 Z" fill="#66CCFF" />  
        <path d="M 16, 32 A 16, 16 0 0, 1 16, 0 Z" fill="#66FF99" />
        <circle r="11" cx="16" cy="16" fill="#ffffff" />    
        </svg>
      `;
    }
  }
}
