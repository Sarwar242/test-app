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
    age?: number;
    birthPlace?: string;
    dob?: string;
}