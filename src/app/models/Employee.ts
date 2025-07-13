export interface IEmployee {
    id?: number;
    name: string;
    age: number;
    gender: string;
    dob: string;
    birthPlace: string;
  }

export interface IEmployeeSearchCriteria {
    name?: string;
    gender?: string;
    minAge?: number;
    maxAge?: number;
    birthPlace?: string;
    dobFrom?: string;
    dobTo?: string;
}