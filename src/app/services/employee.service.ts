import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee, EmployeeInput, EmployeeUpdateInput } from '../models/employee';

// GraphQL Get All Employees Query
const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees {
    getAllEmployees {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

// GraphQL Get Employee By ID Query
const GET_EMPLOYEE_BY_ID = gql`
  query GetEmployeeById($id: ID!) {
    getEmployeeById(id: $id) {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

// GraphQL Get Employees By Filter Query
const GET_EMPLOYEES_BY_FILTER = gql`
  query GetEmployeesByFilter($designation: String, $department: String) {
    getEmployeesByFilter(designation: $designation, department: $department) {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

// GraphQL Create Employee Mutation
const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: EmployeeInput!) {
    createEmployee(input: $input) {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

// GraphQL Update Employee Mutation
const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: EmployeeUpdateInput!) {
    updateEmployee(id: $id, input: $input) {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

// GraphQL Delete Employee Mutation
const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

// Employee Service
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private apollo: Apollo) { }

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo.query<{ getAllEmployees: Employee[] }>({
      query: GET_ALL_EMPLOYEES,
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => result.data.getAllEmployees)
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.apollo.query<{ getEmployeeById: Employee }>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id }
    }).pipe(
      map(result => result.data.getEmployeeById)
    );
  }

  getEmployeesByFilter(designation?: string, department?: string): Observable<Employee[]> {
    return this.apollo.query<{ getEmployeesByFilter: Employee[] }>({
      query: GET_EMPLOYEES_BY_FILTER,
      variables: { designation, department },
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => result.data.getEmployeesByFilter)
    );
  }

  createEmployee(input: EmployeeInput): Observable<Employee> {
    return this.apollo.mutate<{ createEmployee: Employee }>({
      mutation: CREATE_EMPLOYEE,
      variables: { input },
      refetchQueries: [{ query: GET_ALL_EMPLOYEES }]
    }).pipe(
      map(result => result.data?.createEmployee as Employee)
    );
  }

  updateEmployee(id: string, input: EmployeeUpdateInput): Observable<Employee> {
    return this.apollo.mutate<{ updateEmployee: Employee }>({
      mutation: UPDATE_EMPLOYEE,
      variables: { id, input },
      refetchQueries: [{ query: GET_ALL_EMPLOYEES }]
    }).pipe(
      map(result => result.data?.updateEmployee as Employee)
    );
  }

  deleteEmployee(id: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteEmployee: boolean }>({
      mutation: DELETE_EMPLOYEE,
      variables: { id },
      refetchQueries: [{ query: GET_ALL_EMPLOYEES }]
    }).pipe(
      map(result => result.data?.deleteEmployee as boolean)
    );
  }
}