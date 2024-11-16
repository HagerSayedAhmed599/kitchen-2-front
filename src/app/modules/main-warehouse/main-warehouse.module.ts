import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TableModule, CardModule, GridModule, FormModule, ModalModule, ButtonModule, SpinnerModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgbPaginationModule, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MainWarehouseService } from './main-warehouse.service';
import { MainWarehouseComponent } from './main-warehouse/main-warehouse.component';


const routes: Routes = [
  {path:'',component: MainWarehouseComponent},
];

@NgModule({
  declarations: [MainWarehouseComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    CardModule,
    GridModule,
    IconModule,
    FormModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbToast,
    ModalModule,
    ButtonModule,
    NgSelectModule,
    PdfViewerModule,
    SpinnerModule
  ],
  providers:[MainWarehouseService]
})
export class MainWarehouseModule { }
