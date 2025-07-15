import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormsModule } from '@angular/forms';
import { NgClass, NgIf, NgFor, DatePipe } from '@angular/common';
import { EmployeeService } from '../services/EmployeeService';
import { IEmployee, IEmployeeSearchCriteria, IEducationDetail } from '../models/Employee';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgClass, NgIf, NgFor, DatePipe],
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

  // Education Details functionality
  showEducationModal: boolean = false;
  selectedEmployeeForEducation: IEmployee | null = null;
  educationTypes = ['SSC' , 'HSC' , 'UnderGraduate' , 'Graduate' , 'PostGraduate'];
  savingEducation: boolean = false;

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
      return;
    }

    this.fetching = true;
    this.loading = true;
    // console.log('=== FETCH EMPLOYEES START ===');
    // console.log('Loading state set to true');
    // console.log('Fetching page:', page);

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
            
            // console.log('Pagination info:', {
            //   currentPage: this.currentPage,
            //   pageSize: this.pageSize,
            //   totalElements: this.totalElements,
            //   totalPages: this.totalPages,
            //   hasNext: this.hasNext,
            //   hasPrevious: this.hasPrevious
            // });
          } else if (response && response.content && !Array.isArray(response.content)) {
            this.people = [];
          } else if (response && !response.content) {
            this.people = [];
          } else {
            console.warn('Invalid response structure:', response);
            this.people = [];
          }
        } catch (e) {
          console.error('Exception in next handler:', e);
          this.people = [];
        }
        
        this.loading = false;
        this.fetching = false;
        this.cdr.detectChanges();
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
      this.service.updateEmployee(this.employeeForm.value).subscribe({
        next: (res) => {
          this.resetForm();
          this.saving = false;
          this.cdr.detectChanges(); // Force change detection
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
    // id is set for editing
    this.employeeForm.setValue(employee);
  }

  deleteEmployee(index: number, id: number) {
    this.service.deleteEmployee(id).subscribe({
              next: (res) => {
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
        // console.log('Test API response:', response);
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
      return;
    }

    this.fetching = true;
    this.loading = true;
    // console.log('=== SEARCH EMPLOYEES START ===');
    // console.log('Search criteria:', this.searchCriteria);
    // console.log('Searching page:', page);

    this.service.searchEmployees(this.searchCriteria, page, this.pageSize).subscribe({
      next: (response) => {
        console.log('=== SEARCH RESPONSE RECEIVED ===');
        try {
          // console.log('Search response:', response);
          
          if (response && response.content && Array.isArray(response.content)) {
            this.people = response.content as IEmployee[];
            // console.log(`Search found ${this.people.length} employees`);
            
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
          this.people = [];
        }
        
        this.loading = false;
        this.fetching = false;
        // console.log('=== SEARCH EMPLOYEES COMPLETED ===');
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

  // Education Details Methods
  viewEducationDetails(employee: IEmployee) {
    this.selectedEmployeeForEducation = employee;
    this.showEducationModal = true;
  }

  closeEducationModal() {
    this.showEducationModal = false;
    this.selectedEmployeeForEducation = null;
    this.savingEducation = false;
  }

  addEducationDetail() {
    if (!this.selectedEmployeeForEducation) return;

    // Check if all education types are already used
    const availableTypes = this.getAvailableEducationTypes();
    if (availableTypes.length === 0) {
      alert('All education types have been added. You cannot add more education details.');
      return;
    }

    const newEducation: IEducationDetail = {
      type: availableTypes[0] as 'SSC' | 'HSC' | 'UnderGraduate' | 'Graduate' | 'PostGraduate',
      institutionName: '',
      board: '',
      passingYear: '',
      result: '',
      scale: 4
    };

    if (!this.selectedEmployeeForEducation.educationDetails) {
      this.selectedEmployeeForEducation.educationDetails = [];
    }

    this.selectedEmployeeForEducation.educationDetails.push(newEducation);
  }

  // Get education types that are not already selected
  getAvailableEducationTypes(): string[] {
    if (!this.selectedEmployeeForEducation?.educationDetails) {
      return [...this.educationTypes];
    }

    const usedTypes = this.selectedEmployeeForEducation.educationDetails.map(ed => ed.type);
    return this.educationTypes.filter(type => !usedTypes.includes(type as any));
  }

  // Get education types that are available for a specific education detail (for dropdown)
  getAvailableEducationTypesForDetail(currentType: string): string[] {
    if (!this.selectedEmployeeForEducation?.educationDetails) {
      return [...this.educationTypes];
    }

    const usedTypes = this.selectedEmployeeForEducation.educationDetails
      .map(ed => ed.type)
      .filter(type => type !== currentType); // Exclude current type so user can keep the same selection

    return this.educationTypes.filter(type => !usedTypes.includes(type as any));
  }

  // Check if we can add more education details
  canAddMoreEducation(): boolean {
    return this.getAvailableEducationTypes().length > 0;
  }

  // Validate education type change to prevent duplicates
  onEducationTypeChange(education: IEducationDetail, newType: string, index: number) {
    if (!this.selectedEmployeeForEducation?.educationDetails) return;

    // Check if the new type is already used by another education detail
    const isTypeUsed = this.selectedEmployeeForEducation.educationDetails.some((ed, i) => 
      i !== index && ed.type === newType
    );

    if (isTypeUsed) {
      alert(`Education type "${newType}" is already selected. Please choose a different type.`);
      // Reset to original type - we'll handle this in the template
      return false;
    }

    education.type = newType as 'SSC' | 'HSC' | 'UnderGraduate' | 'Graduate' | 'PostGraduate';
    return true;
  }

  removeEducationDetail(index: number) {
    if (!this.selectedEmployeeForEducation?.educationDetails) return;
    
    const educationDetail = this.selectedEmployeeForEducation.educationDetails[index];
    const message = educationDetail.id 
      ? 'Are you sure you want to remove this education detail? This will update the employee record.' 
      : 'Are you sure you want to remove this education detail?';
    
    if (confirm(message)) {
      // Remove from local array first
      this.selectedEmployeeForEducation.educationDetails.splice(index, 1);
      
      // If the education detail had an ID (was loaded from server), update the employee to persist the removal
      // For new education details (no ID), no API call is needed until save is clicked
      if (educationDetail.id && this.selectedEmployeeForEducation.id) {
        this.service.updateEmployee(this.selectedEmployeeForEducation).subscribe({
          next: (response) => {
            console.log('Employee updated after education removal:', response);
            // Update the local data with the response from server
            if (response && response.content) {
              const employeeIndex = this.people.findIndex(emp => emp.id === this.selectedEmployeeForEducation!.id);
              if (employeeIndex !== -1) {
                this.people[employeeIndex] = { ...response.content };
              }
              this.selectedEmployeeForEducation = { ...response.content };
            }
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error updating employee after education removal:', error);
            // Revert the local change if API call failed
            this.selectedEmployeeForEducation!.educationDetails!.splice(index, 0, educationDetail);
            alert('Failed to remove education detail. Please try again.');
            this.cdr.detectChanges();
          }
        });
      } else {
        // If no ID, just update the local state (not yet saved to server)
        this.cdr.detectChanges();
      }
    }
  }

  saveEducationDetails() {
    if (!this.selectedEmployeeForEducation) return;

    this.savingEducation = true;
    
    if (this.selectedEmployeeForEducation.id) {
      this.service.updateEmployee(this.selectedEmployeeForEducation).subscribe({
        next: (response) => {
           // Update the local data with the response from server
          if (response && response.content) {
            // Find and update the employee in the local array
            const employeeIndex = this.people.findIndex(emp => emp.id === this.selectedEmployeeForEducation!.id);
            if (employeeIndex !== -1) {
              this.people[employeeIndex] = { ...response.content };
            }
            // Update the selected employee data as well
            this.selectedEmployeeForEducation = { ...response.content };
          }
          this.savingEducation = false;
          this.closeEducationModal();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error updating employee with education details:', error);
          this.savingEducation = false;
          alert('Failed to save education details. Please try again.');
          this.cdr.detectChanges();
        }
      });
    } else {
      // If no employee ID, just close the modal (shouldn't happen in normal flow)
      console.warn('No employee ID found, cannot save education details');
      this.savingEducation = false;
      this.closeEducationModal();
    }
  }

  getEducationDisplayText(education: IEducationDetail): string {
    return `${education.type} - ${education.institutionName} (${education.passingYear})`;
  }

  hasEducationDetails(): boolean {
    return this.selectedEmployeeForEducation?.educationDetails !== undefined && 
           this.selectedEmployeeForEducation?.educationDetails !== null &&
           this.selectedEmployeeForEducation.educationDetails.length > 0;
  }

  getEducationDetails(): IEducationDetail[] {
    return this.selectedEmployeeForEducation?.educationDetails || [];
  }

  // Make Math available in template
  get Math() {
    return Math;
  }
}