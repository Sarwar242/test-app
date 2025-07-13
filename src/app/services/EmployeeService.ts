import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEmployee, IEmployeeSearchCriteria } from '../models/Employee';
import { Observable } from 'rxjs';
import { ResponseData } from '../models/Responses';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private httpClient:HttpClient){

  }

  getAllEmployees(page: number = 0, size: number = 10):Observable<ResponseData<IEmployee[]>>{
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url = `${environment.API_ROOT}/v1/employees?page=${page}&size=${size}`;
    console.log('Service: Making GET request to', url);
    const observable = this.httpClient.get(url, {headers:reqHeader});
    console.log('Service: Observable created, returning...');
    return observable;
  }

  searchEmployees(searchCriteria: IEmployeeSearchCriteria, page: number = 0, size: number = 10): Observable<ResponseData<IEmployee[]>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Build query parameters
    let params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    // Add search criteria to params
    if (searchCriteria.name && searchCriteria.name.trim()) {
      params.append('name', searchCriteria.name.trim());
    }
    if (searchCriteria.gender && searchCriteria.gender.trim()) {
      params.append('gender', searchCriteria.gender.trim());
    }
    if (searchCriteria.minAge !== null && searchCriteria.minAge !== undefined) {
      params.append('minAge', searchCriteria.minAge.toString());
    }
    if (searchCriteria.maxAge !== null && searchCriteria.maxAge !== undefined) {
      params.append('maxAge', searchCriteria.maxAge.toString());
    }
    if (searchCriteria.birthPlace && searchCriteria.birthPlace.trim()) {
      params.append('birthPlace', searchCriteria.birthPlace.trim());
    }
    if (searchCriteria.dobFrom && searchCriteria.dobFrom.trim()) {
      params.append('dobFrom', searchCriteria.dobFrom.trim());
    }
    if (searchCriteria.dobTo && searchCriteria.dobTo.trim()) {
      params.append('dobTo', searchCriteria.dobTo.trim());
    }

    const url = `${environment.API_ROOT}/v1/employees/search?${params.toString()}`;
    console.log('Service: Making search request to', url);
    return this.httpClient.get(url, { headers: reqHeader });
  }
  
  createEmployee(req: IEmployee): Observable<ResponseData<IEmployee>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': "*"
    });

    return this.httpClient.post(`${environment.API_ROOT}/v1/employee`, req, {
      headers: reqHeader,
    });
  }

  updateEmployee(req: IEmployee): Observable<ResponseData<IEmployee>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': "*"
    });

    return this.httpClient.put(`${environment.API_ROOT}/v1/employee/${req.id}`, req, {
      headers: reqHeader,
    });
  }
  
  deleteEmployee(id: number): Observable<ResponseData<boolean>> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': "*"
    });

    return this.httpClient.delete(`${environment.API_ROOT}/v1/employee/${id}`, {
      headers: reqHeader,
    });
  }

}
