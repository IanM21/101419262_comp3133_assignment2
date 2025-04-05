import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.css']
})
export class EmployeeViewComponent implements OnInit {
  employee: any = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.loadEmployee();
  }

  loadEmployee(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Employee ID is missing';
      return;
    }

    this.loading = true;
    this.employeeService.getEmployeeById(id)
      .subscribe({
        next: (data) => {
          this.employee = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message || 'Failed to load employee details';
          this.loading = false;
        }
      });
  }

  deleteEmployee(): void {
    if (!this.employee || !this.employee._id) return;
    
    if (confirm('Are you sure you want to delete this employee?')) {
      this.loading = true;
      this.employeeService.deleteEmployee(this.employee._id)
        .subscribe({
          next: () => {
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            this.error = error.message || 'Failed to delete employee';
            this.loading = false;
          }
        });
    }
  }
}