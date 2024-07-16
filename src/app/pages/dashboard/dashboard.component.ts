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
          <circle r="16" cx="16" cy="16" fill="#007bff" />
          <circle r="11" cx="16" cy="16" fill="#28a745" />
          <circle r="6" cx="16" cy="16" fill="#ffc107" />
        </svg>
      `;
    }
  }
}
