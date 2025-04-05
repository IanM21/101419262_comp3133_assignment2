import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit {
  employeeId!: string;
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
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.employeeId) {
      this.error = 'Employee ID is missing';
      return;
    }
    
    this.initForm();
    this.loadEmployee();
  }

  initForm(): void {
    this.employeeForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
      employee_photo: ['']
    });
  }

  loadEmployee(): void {
    this.loading = true;
    this.employeeService.getEmployeeById(this.employeeId)
      .subscribe({
        next: (employee) => {
          console.log('Received employee data:', employee); 
          
          try {
            let dateOfJoining = employee.date_of_joining;
            if (dateOfJoining) {
              const date = new Date(dateOfJoining);
              if (!isNaN(date.getTime())) {
                dateOfJoining = date.toISOString().split('T')[0];
              } else {
                console.error('Invalid date:', dateOfJoining);
              }
            }
            
            this.employeeForm.patchValue({
              first_name: employee.first_name || '',
              last_name: employee.last_name || '',
              email: employee.email || '',
              gender: employee.gender || '',
              designation: employee.designation || '',
              salary: employee.salary || '',
              date_of_joining: dateOfJoining || '',
              department: employee.department || '',
              employee_photo: employee.employee_photo || ''
            });
          } catch (err) {
            console.error('Error processing employee data:', err);
            this.error = 'Error processing employee data';
          }
          
          this.loading = false;
        },
        error: (error) => {
          console.error('API error:', error);
          this.error = error.message || 'Failed to load employee details';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
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
      try {
        const date = new Date(formData.date_of_joining);
        if (!isNaN(date.getTime())) {
          formData.date_of_joining = date.toISOString();
        }
      } catch (err) {
        console.error('Error formatting date:', err);
      }
    }

    console.log('Submitting data:', formData);

    this.employeeService.updateEmployee(this.employeeId, formData)
      .subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          this.success = 'Employee updated successfully!';
          this.loading = false;
          
          setTimeout(() => {
            this.router.navigate(['/employees', this.employeeId]);
          }, 1500);
        },
        error: error => {
          console.error('Update error:', error);
          this.error = error.message || 'Failed to update employee. Please try again.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}