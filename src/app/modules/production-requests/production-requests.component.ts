import {Component, OnInit} from '@angular/core';
import {QuotationsService} from '../quotations/quotations.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import value from "*.json";
import {environment} from "../../../environments/environment";
import { ProductionRequestsService } from './production-requests.service';
import { ContractService } from '../contract/contract.service';
import { UsersService } from '../users/users.service';

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
  DevicesData: any[]= []
  AmOrPm:any=[
    {name:"AM" , id:0},
    {name:"PM" , id:1}
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
    // fileTypeId: 1,
  }
  AddReceiveNotice!: FormGroup;
  followsVisible=false;
  attachmentsvisible=false;
  statusvisible=false;
  requestvisible=false;
  dataToPatch:any[]=[];
  selectedOptions: any[] = [];
  Alldevices: any;
  pagesRoleToPatch: any[] = [];
  selectedPageOpions: any[] = [];
  buttons: any[] = [];
  constructor(
    private _QuotationsService: QuotationsService,
    private _FormBuilder: FormBuilder,
    private _productionRequestsService:ProductionRequestsService,
    private toastr: ToastrService,
    private _ConttactService:ContractService,
    private userService:UsersService
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
      measurmentId: [null, [Validators.required]],////
      //measurmentId: [null, [Validators.required]],////
      measurmentDate: [null, [Validators.required]],////
      kitchenModelId: [null, [Validators.required]],////
      kitchenLocation: [null, [Validators.required]],///
      salesId: [null, [Validators.required]],//
      selectedDevice: [null, [Validators.required]],
      AmORPm:[0,[Validators.required]],//
      devices: this._FormBuilder.array([]),
    })
  }
  initFilterForm(): FormGroup {
    return this._FormBuilder.group({
      userId: [null],
      // fileTypeId: [null],
      finalStatusId: [null],
      PageType: 0,
    })
  }

  filter(event: any) {
    console.log(event.value);
    // event.value ? this.query['fileTypeId'] = event.value : this.query['fileTypeId'] = null;
    this.GetShortClientFiles();
  }

  ngOnInit(): void {
    this.GetShortClientFiles();
    this.GetStatusCategoryById()
    this.getDevices()
    this.GetPermissionsOfRole(1)
  }
  getDevices(){
    this._ConttactService.GetStatusCategoryById(19).subscribe(res=>{
      this.DevicesData=res.data.statuses
      console.log(this.DevicesData);

    })
  }
  getReciveNotice(id:any){
    this._productionRequestsService.getReciveNotce(id).subscribe({
      next:(res:any)=>{
          console.log(res.data);

          this.dataToPatch = res.data.devices; // Replace this with actual data
          this.dataToPatch.forEach(device=>{
            this.selectedOptions.push(device.id)
          })
        //statusCategoryById2.log("dataToPatchk",this.MyDevices);
        this.AddReceiveNotice.patchValue({
          salesId : res.data.salesId,
          fileDate:this.dateformat(res.data.fileDate),
          kitchenLocation:res.data.kitchenLocation,
          kitchenModelId:res.data.kitchecnModelId,
          measurmentId:res.data.measurmentid,
          measurmentDate:this.dateformat(res.data.measurmentDate),
          designerId:res.data.designerId,
          designerDate:this.dateformat(res.data.designerDate),
          actionByHour:res.data.actionByHour>12?res.data.actionByHour-12:res.data.actionByHour,
          AmORPm:res.data.actionByHour>12?1:0,
          clientNeed:res.data.clientNeed

        })


      },

    })

  }
  selectOption(event:any,option:any){
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add the option to the selectedOptions array
      if (this.selectedOptions.indexOf(option.statusId) === -1) {
        this.selectedOptions.push(option.statusId);
      }
    } else {
      // Remove the option from the selectedOptions array
      const index = this.selectedOptions.indexOf(option.statusId);
      if (index !== -1) {
        this.selectedOptions.splice(index, 1);

  }
  }
  console.log(this.selectedOptions);
  }
  dateformat(indate :any){
    let year, month, day;
    let contractDate = new Date(indate).toLocaleString().split(',')[0]
    year = contractDate.split('/')[2]
    month = contractDate.split('/')[0]
    day = contractDate.split('/')[1]
    let newContractDate = (year)+'-'+(+month < 10 ? '0'+month : month )+'-'+(+day < 10 ? '0'+day : day )

    console.log(newContractDate);

    return newContractDate;
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
        console.log(this.statusCategoryById2.statuses)
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
    val1 = this.AddReceiveNotice.get('measurmentId')?.value
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
        this.attachmentsvisible=false;
      }, error: (err: any) => {
        this.toastr.error(`${err.message}`);
        this.attachmentsvisible=true;
      }
    })
  }
  DeleteClientFileAttachment(AtthachmentId:any){
    let data={
      "clientFileId":this.clientFileId,
      "attachmentId":AtthachmentId
    }
    this._QuotationsService.DeleteClientFileAttachment(data).subscribe({
      next: (res: any) => {
        this.toastr.success("تم مسح المرفق")
        this.GetAllClientFileAttachment()
      },
      error: (err: any) => {
        this.toastr.error("حدث خطأ أثناء حذف المرفق")
      }
    })
}
  isSelected(statusId: number): boolean {
    return this.selectedOptions.includes(statusId);
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
        this.statusvisible=false;
      }, error: (err: any) => {
        this.toastr.error(`${err.message}`);
        this.statusvisible=true;

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
    this.getReciveNotice(data.clientFileId)
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
        this.followsVisible=false;
      }, error: (err: any) => {
        this.toastr.error(`${err.message}`);
        this.followsVisible=true;
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
    this.AddReceiveNotice.get('actionByHour')?.patchValue(this.AddReceiveNotice.get('AmORPm')?.value==0?this.AddReceiveNotice.get('actionByHour')?.value:this.AddReceiveNotice.get('actionByHour')?.value+12)
    let measermentID=this.AddReceiveNotice.get('measurmentId')?.value
    this.AddReceiveNotice.get('measurmentId')?.patchValue(measermentID.toString());
    const devicesArray = this.AddReceiveNotice.get('devices') as FormArray;

    this.selectedOptions.forEach(device=>{

      devicesArray.push(
        this._FormBuilder.group({
          deviceId: [device, Validators.required],
        })
      )
    })
    let value: any = this.AddReceiveNotice.value;

    value['clientFileId'] = this.clientFileId
    console.log("test",value)

    this._QuotationsService.AddNotices(value).subscribe({
      next: (res: any) => {
        this.toastr.success(`${res.message}`);
        this.GetShortClientFiles();
        //location.reload()
        //this.AddReceiveNotice.reset();
      }, error: (err: any) => {
        this.toastr.error(`${err.message}`);
        this.AddReceiveNotice.get('actionByHour')?.patchValue(this.AddReceiveNotice.get('AmORPm')?.value==0?this.AddReceiveNotice.get('actionByHour')?.value:this.AddReceiveNotice.get('actionByHour')?.value-12)
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
  GetPermissionsOfRole(id: any) {
    this.userService.GetPermissionsOfRole(id).subscribe({
      next: (res: any) => {
        this.pagesRoleToPatch = res.data;
        this.pagesRoleToPatch.forEach(power => {
          this.selectedPageOpions.push(power.id)
          power.pagesAndButtons.forEach((element:any )=> {
            this.buttons.push(element.id)
          });
        })
      }
    })
    this.selectedPageOpions=this.removeDuplicates(this.selectedPageOpions)
    console.log("GetPermissionsOfRole", this.selectedPageOpions);
    console.log("buttons", this.buttons);
  }
  removeDuplicates(arr: any[]):any[]{

    return [...new Set(arr)]
  }
  isAuthorized(permissionId:number) : boolean{
    return this.buttons.includes(permissionId)
  }
}
