import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TableModule, CardModule, GridModule, FormModule, ModalModule, ButtonModule, SpinnerModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgbPaginationModule, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportsHomeComponent } from './reports-home/reports-home.component';
import { ContractReportsComponent } from './contract-reports/contract-reports.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TarkeebReminderComponent } from './tarkeeb-reminder/tarkeeb-reminder.component';
import { FollowReportComponent } from './follow-report/follow-report.component';
import { KitchenStatusReportComponent } from './kitchen-status-report/kitchen-status-report.component';
const routes: Routes = [
  {path:'',component: ReportsHomeComponent},
  {path:'contractReport',component: ContractReportsComponent},
  {path:'TarkeebReminder',component: TarkeebReminderComponent},
  {path:'FollowReport',component: FollowReportComponent},
  {path:'KitchenStatusReport',component: KitchenStatusReportComponent}

];


@NgModule({
  declarations: [
    ReportsHomeComponent,
    ContractReportsComponent,
    TarkeebReminderComponent,
    FollowReportComponent,
    KitchenStatusReportComponent
  ],
  imports: [
    CommonModule,
    PdfViewerModule,
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
    SpinnerModule,
  ]
})
export class ReportsModule { }
