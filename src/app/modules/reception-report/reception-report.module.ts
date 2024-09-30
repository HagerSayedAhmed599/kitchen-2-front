import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TableModule, CardModule, GridModule, FormModule, ModalModule, ButtonModule, SpinnerModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgbPaginationModule, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReceptionReportComponent } from './reception-report.component';
import { FormReceptionReportComponent } from './form-reception-report/form-reception-report.component';
//import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ReportReceptionReportComponent } from './report-reception-report/report-reception-report.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ReceptionReportService } from './reception-report.service';

const routes: Routes = [
  {path:'',component: ReceptionReportComponent},
  {path:'add',component: FormReceptionReportComponent},
  {path:'print',component:ReportReceptionReportComponent}
];

@NgModule({
  declarations: [
    ReceptionReportComponent,
    FormReceptionReportComponent,
    ReportReceptionReportComponent
  ],
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
  providers:[ReceptionReportService]
})
export class ReceptionReportModule { }
