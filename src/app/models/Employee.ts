export interface IEducationDetail {
    id?: number;
    type: 'SSC' | 'HSC' | 'UnderGraduate' | 'Graduate' | 'PostGraduate';
    institutionName: string;
    board: string;
    passingYear: string;
    result: string;
    scale: number;
}

export interface IEmployee {
    id?: number;
    name: string;
    age: number;
    gender: string;
    dob: string;
    birthPlace: string;
    educationDetails?: IEducationDetail[];
  }

export interface IEmployeeSearchCriteria {
    name?: string;
    gender?: string;
    age?: number;
    birthPlace?: string;
    dob?: string;
}