import { Routes } from '@angular/router';

import { HelloComponent } from './hello/hello-component';
import { TestComponent } from './test/test-component';
import { HomeComponent } from './home/home';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { 
        path: 'test', 
        component: TestComponent
      },
      { 
        path: 'hello', 
        component: HelloComponent 
      },
      { 
        path: 'home', 
        component: HomeComponent  
      },
      { 
        path: '', 
        redirectTo: '/home', 
        pathMatch: 'full' 
      }
    ]
  }
];

