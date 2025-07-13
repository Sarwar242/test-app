import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEmployee } from '../models/Employee';
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
