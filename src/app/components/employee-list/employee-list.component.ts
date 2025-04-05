import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  loading = false;
  error = '';
  
  searchDepartment = '';
  searchDesignation = '';
  
  departments: string[] = [];
  designations: string[] = [];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees()
      .subscribe({
        next: (data) => {
          this.employees = data;
          this.filteredEmployees = [...data];
          this.loading = false;
          
          this.departments = [...new Set(data.map(emp => emp.department))];
          this.designations = [...new Set(data.map(emp => emp.designation))];
        },
        error: (error) => {
          this.error = error.message || 'Failed to load employees';
          this.loading = false;
        }
      });
  }

  applyFilter(): void {
    if (!this.searchDepartment && !this.searchDesignation) {
      this.filteredEmployees = [...this.employees];
      return;
    }
    
    this.loading = true;
    this.employeeService.getEmployeesByFilter(
      this.searchDesignation || undefined, 
      this.searchDepartment || undefined
    ).subscribe({
      next: (data) => {
        this.filteredEmployees = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Error applying filters';
        this.loading = false;
      }
    });
  }

  resetFilters(): void {
    this.searchDepartment = '';
    this.searchDesignation = '';
    this.filteredEmployees = [...this.employees];
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.loading = true;
      this.employeeService.deleteEmployee(id)
        .subscribe({
          next: () => {
            this.loadEmployees();
          },
          error: (error) => {
            this.error = error.message || 'Failed to delete employee';
            this.loading = false;
          }
        });
    }
  }
}