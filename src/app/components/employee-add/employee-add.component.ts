import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent implements OnInit {
  employeeForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  
  genderOptions = ['Male', 'Female'];
  departmentOptions = ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance', 'IT Support', 'Administration'];
  designationOptions = ['Manager', 'Developer', 'Designer', 'Tester', 'Analyst', 'HR Executive', 
                        'Sales Executive', 'Team Lead', 'Senior Developer', 'Support Specialist', 'Director'];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.employeeForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['Male'],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
      employee_photo: ['']
    });
  }

  get f() { return this.employeeForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    this.error = '';
    this.success = '';

    if (this.employeeForm.invalid) {
      return;
    }

    this.loading = true;
    
    const formData = { ...this.employeeForm.value };
    if (formData.date_of_joining) {
      formData.date_of_joining = new Date(formData.date_of_joining).toISOString();
    }

    this.employeeService.createEmployee(formData)
      .subscribe({
        next: () => {
          this.success = 'Employee created successfully!';
          this.loading = false;
          
          setTimeout(() => {
            this.router.navigate(['/employees']);
          }, 1500);
        },
        error: error => {
          this.error = error.message || 'Failed to create employee. Please try again.';
          this.loading = false;
        }
      });
  }
}