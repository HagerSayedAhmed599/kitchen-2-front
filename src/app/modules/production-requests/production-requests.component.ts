import {Component, OnInit} from '@angular/core';
import {QuotationsService} from '../quotations/quotations.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import value from "*.json";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-production-requests',
  templateUrl: './production-requests.component.html',
  styleUrls: ['./production-requests.component.scss']
})
export class ProductionRequestsComponent implements OnInit{
  Domain: any = environment.apiUrl;
  today: Date = new Date();
  allQuotations: any[] = [];
  MyDevices: any[] = [];
  statusCategoryById: any;
  statusCategoryById2: any;
  allUsersData: any;
  cities: any;
  DevicesData: any= [
    {name: 'ثلاجة',id: 1 },
    {name: 'غسالة',id: 2 },
    {name: 'ثلاجة',id: 3 },
    {name: 'بوتجاز',id: 4 },
  ]
  clientData: any;
  selectedCity: any;
  viewImg: any[] = [];
  uploadedImg: any[] = [];
  allClientFileFollowUp: any[] = [];
  AllFinalStatusClientFile: any[] = [];
  LoadFinalStatusList: any[] = [];
  allClientFileAttachment: any[] = [];
  currentPage: number = 1;
  filterForm!: FormGroup;
  clientFileId: number = 0;
  statusId: number = 0;
  Note: String = '';
  query: any = {
    PageType: 4,
    fileTypeId: 1,
  }
  AddReceiveNotice!: FormGroup;

  constructor(
    private _QuotationsService: QuotationsService,
    private _FormBuilder: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.AddReceiveNotice = this.initReceiveNoticeForm();
  }
  initReceiveNoticeForm(): FormGroup {
    return this._FormBuilder.group({
      clientFileId: [null, [Validators.required]],
      fileDate: [null, [Validators.required]],//
      actionByHour: [null, [Validators.required]],
      clientNeed: [null, [Validators.required]],
      designerId: [null, [Validators.required]],///
      designerDate: [null, [Validators.required]],///
      measurementId: [null, [Validators.required]],////
      measurmentId: [null, [Validators.required]],////
      measurmentDate: [null, [Validators.required]],////
      kitchenModelId: [null, [Validators.required]],////
      kitchenLocation: [null, [Validators.required]],///
      salesId: [null, [Validators.required]],//
      selectedDevice: [null, [Validators.required]],//
      devices: [[], [Validators.required]]
    })
  }
  initFilterForm(): FormGroup {
    return this._FormBuilder.group({
      userId: [null],
      fileTypeId: [null],
      finalStatusId: [null],
      PageType: 0,
    })
  }

  filter(event: any) {
    console.log(event.value);
    event.value ? this.query['fileTypeId'] = event.value : this.query['fileTypeId'] = null;
    this.GetShortClientFiles();
  }

  ngOnInit(): void {
    this.GetShortClientFiles();
    this.GetStatusCategoryById()
    console.log(this.device)
  }

  GetShortClientFiles() {
    this._QuotationsService.GetShortClientFiles(this.query).subscribe({
      next: (res: any) => {
        this.allQuotations = res.data
        console.log(this.allQuotations);

      },
      error: (err: any) => {
        Object.entries(err.errors).forEach(([key, value]) => {
          // console.log(`Key: ${key}, Value: ${value}`);
          this.toastr.error(`${value}`);
        });
      }
    })
  }

  GetStatusCategoryById() {
    this._QuotationsService.GetStatusCategoryById(100).subscribe({
      next: (res: any) => {
        this.statusCategoryById = res.data
        console.log()
        this.statusId = res.data.statuses[0].statusId
      }
    })
  }
  GetStatusCategoryById2() {
    this._QuotationsService.GetStatusCategoryById(18).subscribe({
      next: (res: any) => {
        this.statusCategoryById2 = res.data
        console.log()
        this.statusId = res.data.statuses[0].statusId
      }
    })
  }
  GetAllUsers() {
    this._QuotationsService.GetAllUsersApi().subscribe({
      next: (res: any) => {
        this.allUsersData = res.data
      }
    })
  }
  setMeasurement() {
    let val1, val2
    val1 = this.AddReceiveNotice.get('measurementId')?.value
    val2 = val1.toString()
    console.log(val2)
    this.AddReceiveNotice.patchValue({
      measurmentId: val2
    })
  }

  onImageSelected(event: any): void {
    this.viewImg = []
    this.uploadedImg = []
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      this.uploadedImg.push(event.target.files.item(0));
      reader.onload = (event: any) => {
        this.viewImg.push(event.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  AddClientFileAttachment() {
    let value: any = {};
    value['clientFileId'] = this.clientFileId;
    value['attachmentPath'] = this.uploadedImg[0];
    value['statusId'] = this.statusId;
    this._QuotationsService.AddClientFileAttachment(value).subscribe({
      next: (res: any) => {
        this.toastr.success(`${res.message}`);
        this.viewImg = []
        this.uploadedImg = []
        this.GetAllClientFileAttachment()
        this.GetShortClientFiles();
      }, error: (err: any) => {
        this.toastr.error(`${err.message}`);
      }
    })
  }
  AddFinalStatusList() {
    let value: any = {};
    value['clientFileId'] = this.clientFileId;
    value['finalStatusId'] = this.statusId;
    value['notes'] = this.Note;
    this._QuotationsService.AddFinalStatusListApi(value).subscribe({
      next: (res: any) => {
        this.toastr.success(`${res.message}`);
        this.viewImg = []
        this.uploadedImg = []
        this.GetAllFinalStatusClientFile()
        this.GetShortClientFiles();
      }, error: (err: any) => {
        this.toastr.error(`${err.message}`);
      }
    })
  }

  GetAllClientFileAttachment() {
    let query = {
      clientFileId: this.clientFileId,
      statusId: this.statusId,
    }
    this._QuotationsService.GetAllClientFileAttachment(query).subscribe({
      next: (res: any) => {
        this.allClientFileAttachment = res.data
      }
    })
  }
  GetAllClientNotice(data: any) {
    this.clientData = data.client
    this.GetAllUsers()
    this.GetStatusCategoryById2()
  }

  AddDevice() {
    this.MyDevices.push(
      this.DevicesData.filter((ele: any) => ele.id === this.AddReceiveNotice.get('selectedDevice')?.value)[0]
    )
    console.log(this.MyDevices)
    this.devices?.value.push(
      {deviceId: this.AddReceiveNotice.get('selectedDevice')?.value}
    )
  }
  DeleteDevice(i: number) {
    this.MyDevices.splice(i, 1);
    this.devices?.get('deviceId')?.value.splice(i, 1);
    console.log(this.MyDevices)
    console.log(this.device)
  }
  AddClientFileFollowUp() {
    let value: any = {};
    value['clientFileId'] = this.clientFileId;
    value['attachment'] = this.uploadedImg[0];
    value['Note'] = this.Note;
    this._QuotationsService.AddClientFileFollowUp(value).subscribe({
      next: (res: any) => {
        this.toastr.success(`${res.message}`);
        this.viewImg = []
        this.uploadedImg = [];
        this.Note = ''
        this.GetShortClientFiles();
        this.GetAllFollowUp();
      }, error: (err: any) => {
        this.toastr.error(`${err.message}`);
      }
    })
  }
  get devices() {
    return this.AddReceiveNotice.get('devices')
  }
  get device() {
    return this.devices?.get('deviceId')?.value
  }
  AddNotice() {
    let value: any = this.AddReceiveNotice.value;
    value['clientFileId'] = this.clientFileId
    this._QuotationsService.AddNotices(value).subscribe({
      next: (res: any) => {
        this.toastr.success(`${res.message}`);
        this.GetShortClientFiles();
        location.reload()
      }, error: (err: any) => {
        this.toastr.error(`${err.message}`);
      }
    })
  }

  GetAllFollowUp() {
    this._QuotationsService.GetAllFollowUp(this.clientFileId).subscribe({
      next: (res: any) => {
        console.log(res)
        this.allClientFileFollowUp = res.data
      }
    })
  }
  GetAllFinalStatusClientFile() {
    this._QuotationsService.AllFinalStatusClientFile(this.clientFileId).subscribe({
      next: (res: any) => {
        console.log(res)
        this.AllFinalStatusClientFile  = res.data
      }
    })
  }

  GetLoadFinalStatusList() {
    console.log(this.query.PageType)
    this._QuotationsService.LoadFinalStatusList(this.query.PageType).subscribe({
      next: (res: any) => {
        this.LoadFinalStatusList = res.data.statuses
      }
    })
  }
}
