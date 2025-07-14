import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgClass, NgIf, NgFor, DatePipe } from '@angular/common';
import { EmployeeService } from '../services/EmployeeService';
import { IEmployee, IEmployeeSearchCriteria } from '../models/Employee';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, NgFor, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  people: IEmployee[] = [];
  loading: boolean = false;
  saving: boolean = false;
  private fetching: boolean = false;
  
  // Search functionality
  isSearchMode: boolean = false;
  searchCriteria: IEmployeeSearchCriteria = {};
  showSearchPanel: boolean = false;
  
  // Pagination properties
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;

  employeeForm: FormGroup;
  searchForm: FormGroup;
  editingIndex: number | null = null;

  constructor(private fb: FormBuilder, private service: EmployeeService, private cdr: ChangeDetectorRef) {
    this.employeeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      age: [0, [Validators.required, Validators.min(0)]],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      birthPlace: ['', Validators.required]
    });

    this.searchForm = this.fb.group({
      name: [''],
      gender: [''],
      age: [''],
      birthPlace: [''],
      dob: ['']
    });
  }

  ngOnInit(): void {
    this.fetchEmployees();
  }
  
  fetchEmployees(page: number = 0) {
    if (this.fetching) {
      console.log('Already fetching employees, skipping...');
      return;
    }

    this.fetching = true;
    this.loading = true;
    console.log('=== FETCH EMPLOYEES START ===');
    console.log('Loading state set to true');
    console.log('Fetching page:', page);



    this.service.getAllEmployees(page, this.pageSize).subscribe({
      next: (response) => {
        try {
          
          if (response && response.content && Array.isArray(response.content)) {
            this.people = response.content as IEmployee[];
            
            // Update pagination info
            this.currentPage = response.number || 0;
            this.pageSize = response.size || 10;
            this.totalElements = response.totalElements || 0;
            this.totalPages = response.totalPages || 0;
            this.hasNext = response.last === false;
            this.hasPrevious = response.first === false;
            
            console.log('Pagination info:', {
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              totalElements: this.totalElements,
              totalPages: this.totalPages,
              hasNext: this.hasNext,
              hasPrevious: this.hasPrevious
            });
          } else if (response && response.content && !Array.isArray(response.content)) {
            console.warn('Content is not an array:', response.content);
            this.people = [];
          } else if (response && !response.content) {
            console.warn('No content in response:', response);
            this.people = [];
          } else {
            console.warn('Invalid response structure:', response);
            this.people = [];
          }
        } catch (e) {
          console.error('Exception in next handler:', e);
          alert('Error processing employee data. See console for details.');
          this.people = [];
        }
        
        this.loading = false;
        this.fetching = false;
        console.log('=== FETCH EMPLOYEES COMPLETED ===');
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        this.people = [];
        this.loading = false;
        this.fetching = false;
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  addEmployee() {
    if (this.employeeForm.valid) {
      this.saving = true;
      this.service.createEmployee(this.employeeForm.value).subscribe({
        next: (res) => {
          console.log('Employee created:', res);
          this.resetForm();
          this.saving = false;
          this.cdr.detectChanges(); // Force change detection
          this.fetchEmployees(this.currentPage); // Refresh the current page
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          this.saving = false;
          this.cdr.detectChanges(); // Force change detection
        }
      });
    }
  }

  updateEmployee() {
    if (this.employeeForm.valid && this.editingIndex !== null) {
      this.saving = true;
      console.log('Starting update for employee:', this.employeeForm.value);
      this.service.updateEmployee(this.employeeForm.value).subscribe({
        next: (res) => {
          console.log('Employee updated successfully:', res);
          this.resetForm();
          this.saving = false;
          this.cdr.detectChanges(); // Force change detection
          console.log('About to fetch employees after update...');
          this.fetchEmployees(this.currentPage); // Refresh the current page
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          this.saving = false;
          this.cdr.detectChanges(); // Force change detection
        }
      });
    }
  }

  editEmployee(index: number) {
    this.editingIndex = index;
    const employee = { ...this.people[index] };
    if (employee.dob) {
      employee.dob = employee.dob.split('T')[0];
    }
    this.employeeForm.setValue(employee);
  }

  deleteEmployee(index: number, id: number) {
    this.service.deleteEmployee(id).subscribe({
              next: (res) => {
          console.log('Employee deleted:', res);
          this.cdr.detectChanges(); // Force change detection
          this.fetchEmployees(this.currentPage); // Refresh the current page
          if (this.editingIndex === index) {
            this.resetForm();
          }
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.cdr.detectChanges(); // Force change detection
        }
    });
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

  testApi() {
    console.log('=== TESTING API DIRECTLY ===');
    this.service.getAllEmployees().subscribe({
      next: (response) => {
        console.log('Test API response:', response);
        alert('API test successful! Check console for details.');
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        console.error('Test API error:', error);
        alert('API test failed! Check console for details.');
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  // Pagination methods
  nextPage() {
    if (this.hasNext) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.hasPrevious) {
      this.goToPage(this.currentPage - 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(0, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages - 1, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Search functionality methods
  toggleSearchPanel() {
    this.showSearchPanel = !this.showSearchPanel;
    if (!this.showSearchPanel) {
      this.clearSearch();
    }
  }

  performSearch() {
    if (this.searchForm.invalid) {
      return;
    }

    this.searchCriteria = { ...this.searchForm.value };
    this.isSearchMode = true;
    this.currentPage = 0; // Reset to first page for new search
    this.searchEmployees();
  }

  searchEmployees(page: number = 0) {
    if (this.fetching) {
      console.log('Already fetching employees, skipping...');
      return;
    }

    this.fetching = true;
    this.loading = true;
    console.log('=== SEARCH EMPLOYEES START ===');
    console.log('Search criteria:', this.searchCriteria);
    console.log('Searching page:', page);



    this.service.searchEmployees(this.searchCriteria, page, this.pageSize).subscribe({
      next: (response) => {
        console.log('=== SEARCH RESPONSE RECEIVED ===');
        try {
          console.log('Search response:', response);
          
          if (response && response.content && Array.isArray(response.content)) {
            this.people = response.content as IEmployee[];
            console.log(`Search found ${this.people.length} employees`);
            
            // Update pagination info
            this.currentPage = response.number || 0;
            this.pageSize = response.size || 10;
            this.totalElements = response.totalElements || 0;
            this.totalPages = response.totalPages || 0;
            this.hasNext = response.last === false;
            this.hasPrevious = response.first === false;
          } else {
            console.warn('Invalid search response structure:', response);
            this.people = [];
          }
        } catch (e) {
          console.error('Exception in search handler:', e);
          alert('Error processing search results. See console for details.');
          this.people = [];
        }
        
        this.loading = false;
        this.fetching = false;
        console.log('=== SEARCH EMPLOYEES COMPLETED ===');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('=== SEARCH ERROR RECEIVED ===');
        console.error('Search error:', error);
        this.people = [];
        this.loading = false;
        this.fetching = false;
        alert('Search failed. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }

  clearSearch() {
    this.searchForm.reset();
    this.searchCriteria = {};
    this.isSearchMode = false;
    this.currentPage = 0;
    this.fetchEmployees(); // Fetch all employees
  }

  // Override pagination methods to handle search mode
  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      if (this.isSearchMode) {
        this.searchEmployees(page);
      } else {
        this.fetchEmployees(page);
      }
    }
  }

  // Make Math available in template
  get Math() {
    return Math;
  }
}