import { Routes } from '@angular/router';
import { TestComponent } from './test-component/test-component';
import { HomeComponent } from './home/home';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'test-component', component: TestComponent }
];

  