import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { EmployeeService } from './services/EmployeeService';
import { IEmployee } from './models/Employee';
import { NgIf, NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, NgClass, NgIf, NgFor, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  people: IEmployee[] = [
    {
      name: 'Aminul',
      age: 29,
      gender: 'Male',
      dob: '1996-01-01',
      birthPlace: 'Rajshahi'
    }
  ];

  employeeForm: FormGroup;
  editingIndex: number | null = null;

  constructor(private fb: FormBuilder, private service:EmployeeService) {
    this.employeeForm = this.fb.group({
      id:[null],
      name: ['', Validators.required],
      age: [0, [Validators.required, Validators.min(0)]],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      birthPlace: ['', Validators.required]
    });
  }

  ngOnInit(): void {
     this.fetchEmployees();
  }

  fetchEmployees() {
   this.service.getAllEmployees().subscribe((response):any=>{
    console.log(response);
   
      this.people= response?.content as IEmployee[];
  
      
   },
  error=>{
    console.log("Error fetching data: ", error);
  });
      
  } 

  addEmployee() {
    if (this.employeeForm.valid) {
      this.people.push(this.employeeForm.value);
      this.service.createEmployee(this.employeeForm.value).subscribe((res)=>{
        console.log(res);
      });
      this.resetForm();
    }
  }

  updateEmployee() {
    if (this.employeeForm.valid && this.editingIndex !== null) {
      this.people[this.editingIndex] = this.employeeForm.value;
      this.service.updateEmployee(this.employeeForm.value).subscribe((res)=>{
        console.log(res);
      });
      this.resetForm();
    }
  }

  editEmployee(index: number) {
    this.editingIndex = index;
    const employee = { ...this.people[index] };
    // Convert dob to yyyy-MM-dd if it exists and is not already in that format
    if (employee.dob) {
      employee.dob = employee.dob.split('T')[0];
    }
    this.employeeForm.setValue(employee);
  }

  deleteEmployee(index: number, id:number) {
    this.service.deleteEmployee(id).subscribe((res)=>{
      console.log(res);
    });
    this.people.splice(index, 1);
    if (this.editingIndex === index) {
      this.resetForm();
    }
  }

  confirmUpdate(): boolean {
    return confirm('Are you sure you want to update this record?');
  }

  confirmDelete(index: number, id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.deleteEmployee(index, id);
    }
  }

  resetForm() {
    this.employeeForm.reset();
    this.editingIndex = null;
  }
}
