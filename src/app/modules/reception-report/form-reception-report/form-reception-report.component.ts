import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Clients, DataClients } from '../../clients/modal/clients';
import { ClientsService } from '../../clients/clients.service';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from '../../contract/contract.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceptionReportService } from '../reception-report.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-form-reception-report',
  templateUrl: './form-reception-report.component.html',
  styleUrls: ['./form-reception-report.component.scss']
})
export class FormReceptionReportComponent {
  clientFileId:any;
  AddClientFileForm!: FormGroup;
  clientForm! :FormGroup;
  fileTypeId: any;
  allClients: DataClients[] = [];
  selectedOptions: any[] = [];
  dataToPatch:any[]=[];
  AmOrPm:any=[
    {name:"AM" , id:0},
    {name:"PM" , id:1}
  ]
  clientFileTypes: any = [
    {
      name: 'المطابخ',
      id: 1
    },
    {
      name: 'الابواب',
      id: 2
    },
    {
      name: 'خزائن الحائط',
      id: 4
    },
    {
      name: 'الاعمال الخشبية',
      id: 6
    },
  ];
  buildingData: any = [
    {name: "في عهده الحارس", id: 1},
    {name: " تصميم ", id: 2},
    {name: " الترتيب مسبقا ", id: 3},
    {name: "قياس  ", id: 4},
    {name: "جاهز  ", id: 5},
    {name: "تحت التشطيب  ", id: 6},
    {name: "تحت الإنشاء  ", id: 7},
  ];
  servicesData: any = [
    {name: " مطبخ ", id: 1},
    {name: " مفروشات ", id: 2},
    {name: " مغاسل ", id: 3},
    {name: " غرفة غسيل ", id: 4},
    {name: "خزائن حائط  ", id: 5},
  ];
  orderData: any = [
    {name: " مناسب ", id: 1},
    {name: " كاونتر ", id: 2},
    {name: " امريكي ", id: 3},
    {name: "  جزيرة وسطية ", id: 4},
    {name: " ألماني  ", id: 5},
    {name: " طاولة  ", id: 6},

  ];

  KitchenType:any[]=[]
  MyDevices: any[]=[];
  users: any;
  Alldevices: any;
  discreption: any;
  governorate: any;
  area: any;
  BuildingData: any;
  ServicesData: any;
  OrderData: any;
  constructor(private _FormBuilder: FormBuilder,
              private recptionReportService:ReceptionReportService,
              private _ClientsService: ClientsService,
              private toastr: ToastrService,
              private _Router:Router,
              private _activatedRoute: ActivatedRoute,
              private _ConttactService:ContractService) {
                this.clientFileId=this._activatedRoute.snapshot.queryParamMap.get('clientFileId')
    this.AddClientFileForm = this.initClientFileForm();
    this.clientForm=this.initClientForm()
  }
  ngOnInit(): void {
   // this.AddClientFileForm.get('AmORPm')?.patchValue(0);
    let fileTypeId: any = this._activatedRoute.snapshot.queryParamMap.get('fileTypeId')
    console.log(this.clientFileId);

    this.GetAllClients();
    this.GetDevices();
    this.GetKitchenType();
    this.getAllUsers()
    if(this.clientFileId){
      this.getReceptionReportById(this.clientFileId)
    }

    this.fileTypeId = +fileTypeId
    if (fileTypeId) {
      this.AddClientFileForm.patchValue({
        fileTypeId: +fileTypeId
      });
    }
  }

  AddClientFile(){
    // this.AddClientFileForm.get('actionByHour')?.patchValue(this.AddClientFileForm.get('AmORPm')?.value==0?this.AddClientFileForm.get('actionByHour')?.value:this.AddClientFileForm.get('actionByHour')?.value+12)
    // let measermentID=this.AddClientFileForm.get('measurmentId')?.value
    // this.AddClientFileForm.get('measurmentId')?.patchValue(measermentID? measermentID.toString():'');
    // let val1, val2
    // val1 = this.AddClientFileForm.controls['measurmentId']?.value
    // val2 = val1.toString()
    // console.log(val2)
    // if(this.clientFileId!=null){

    //   this.AddClientFileForm.get('clientFileId')?.patchValue(this.clientFileId)
    // }

    // this.AddClientFileForm.patchValue({
    //   measurmentId: val2
    // })
    // this.AddClientFileForm.patchValue({
    //   clientId:this.clientForm.get('clientId')?.value
    // })
    // console.log(this.AddClientFileForm.get('devices')?.value)
    // // this.AddClientFileForm.get('devices')?.reset();
    // const devicesArray = this.AddClientFileForm.get('devices') as FormArray;

    // this.selectedOptions.forEach(device=>{

    //   devicesArray.push(
    //     this._FormBuilder.group({
    //       deviceId: [device, Validators.required],
    //     })
    //   )
    // })
    console.log(this.AddClientFileForm.value);

    this.recptionReportService.AddUpdatereceptionReport(this.AddClientFileForm.value).subscribe(res=>{
this.toastr.success("added")
this.getReceptionReportById(this.clientFileId)
this._Router.navigateByUrl('/reception-report')
    },err=>{
      this.toastr.error(err.errors[0])
      this.AddClientFileForm.get('actionByHour')?.patchValue(this.AddClientFileForm.get('AmORPm')?.value==0?this.AddClientFileForm.get('actionByHour')?.value:this.AddClientFileForm.get('actionByHour')?.value-12)
    })


  }
  GetAllClients() {
    this._ClientsService.GetAllClients().subscribe({
      next: (res: Clients) => {
        this.allClients = res.data
      }
    })
  }
  getClientInfo(clientId:any){

     console.log(clientId);
if (clientId) {
  this._ClientsService.GetClient(clientId).subscribe((res:any)=>{
    console.log(res);

    this.clientForm.patchValue({

      phoneNumber:res.data[0].mobile,
      clientAdress:res.data[0].clientAddress
    })
  })
}
  }
  GetDevices(){
this._ConttactService.GetStatusCategoryById(19).subscribe(res=>{
  this.Alldevices=res.data.statuses
  console.log(this.Alldevices);

})
  }

  GetBuildingData() {
    this.recptionReportService.GetAllBuildingData().subscribe(data=> {
      this.BuildingData = data
    })
  }
  GetServicesData() {
    this.recptionReportService.GetAllServicesData().subscribe(data=> {
      this.ServicesData = data
    })
  }
  GetOrderData() {
    this.recptionReportService.GetAllOrderData().subscribe(data=> {
      this.OrderData = data
    })
  }
  GetKitchenType(){
    this._ConttactService.GetStatusCategoryById(18).subscribe(res=>{
      this.KitchenType=res.data.statuses
    })
  }
  initClientForm():FormGroup{
    return this._FormBuilder.group({
       clientId: [null, [Validators.required]],
      //  phoneNumber: [null, [Validators.required]],
       phoneNumber1: [null, [Validators.required]],
       phoneNumber2: [null, [Validators.required]],
       phoneNumber3: [null, [Validators.required]],
       phoneNumber4: [null, [Validators.required]],
       phoneNumber5: [null, [Validators.required]],
       governorateId: [null, [Validators.required]],
       clientAdress:[null,[Validators.required]],
    })
  }

  initClientFileForm(): FormGroup {
    return this._FormBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      descriptionId: [null, [Validators.required]],
      areaId: [null, [Validators.required]],
      salesId:[null,[Validators.required]],
      fileDate: [null, [Validators.required]],
      selectedDevice:[null, [Validators.required]],
      selectedBuilding: [null, [Validators.required]],
      selectedService: [null, [Validators.required]],
      selectedOrder: [null, [Validators.required]],
      kitchenUsers: [null, [Validators.required]],
      kitchenLocation: [null, [Validators.required]],
      // devices: this._FormBuilder.array([]),
})
}
//   initClientFileForm(): FormGroup {
//     return this._FormBuilder.group({
//       clientFileId: [null, [Validators.required]],
//       clientId: [null, [Validators.required]],
//       fileDate: [null, [Validators.required]],
//       actionByHour: [null, [Validators.required]],
//       clientNeed: [null, [Validators.required]],
//       designerId: [null, [Validators.required]],
//       designerDate: [null, [Validators.required]],
//       measurmentDate: [null, [Validators.required]],
//       measurmentId: [null, [Validators.required]],
//       kitchenModelId: [null, [Validators.required]],
//       kitchenLocation: [null, [Validators.required]],
//       devices: this._FormBuilder.array([]),
//       selectedDevice:[null, [Validators.required]],
//       salesId:[null,[Validators.required]],
//       AmORPm:[0,[Validators.required]]

// })
// }
setMeasurement() {
  let val1, val2
  val1 = this.AddClientFileForm.get('measurmentId')?.value
  console.log(val1)
  val2 = val1.toString()
  console.log(val2)
  this.AddClientFileForm.patchValue({
    measurmentId: val2
  })
}
// AddDevice() {
//   this.MyDevices.push(
//     this.devices.filter((ele: any) => ele.id === this.AddClientFileForm.get('devices')?.value)[0]
//   )
//   console.log(this.MyDevices)
//   this.alldevices?.value.push(
//     {deviceId: this.AddClientFileForm.get('devices')?.value}
//   )
//   this.AddClientFileForm.controls['devices'].patchValue(this.alldevices)
// }
// DeleteDevice(i: number) {
//   this.MyDevices.splice(i, 1);
//   this.alldevices?.get('deviceId')?.value.splice(i, 1);
//   console.log(this.MyDevices)
//   console.log(this.device)
// }
// get alldevices() {
//   return this.AddClientFileForm.get('devices')
// }
// get device() {
//   return this.alldevices?.get('deviceId')?.value
// }
AddNotice() {
  let value: any = this.AddClientFileForm.value;
  value['clientFileId'] = this.clientFileId
  this.recptionReportService.AddUpdatereceptionReport(value).subscribe({
    next: (res: any) => {
      this.toastr.success(`${res.message}`);

     // location.reload()
    }, error: (err: any) => {
      this.toastr.error(`${err.message}`);
    }
  })
}
getAllUsers(){
  this._ConttactService.GetAllUsersApi().subscribe(res=>{
    this.users = res.data
  })
}
getAllDiscreption() {
  this.recptionReportService.GetAllDiscreption().subscribe(data=> {
    this.discreption = data.data
  })
}
getAllGovernorate() {
  this.recptionReportService.GetAllGovernorate().subscribe(data=> {
    this.governorate = data.data
  })
}
getAllArea() {
  this.recptionReportService.GetAllArea().subscribe(data=> {
    this.area = data.data
  })
}
isSelected(statusId: number): boolean {
  return this.selectedOptions.includes(statusId);
}
getReceptionReportById(clientFileId:any){

  this.recptionReportService.GetReceptionReportById(clientFileId).subscribe((res:any)=>{
    let receptionReport=res.data;
     this.dataToPatch = res.data.devices; // Replace this with actual data
    this.dataToPatch.forEach(device=>{
      this.selectedOptions.push(device.id)
    })

    console.log(this.selectedOptions);


    this.AddClientFileForm.patchValue({
      // clientId:receptionReport
      actionByHour:res.data.actionByHour>12?res.data.actionByHour-12:res.data.actionByHour,
      designerId:receptionReport.designerId,
      designerDate:this.handleDate(receptionReport.designerDate),
      measurmentId:receptionReport.measurmentid,
      measurmentDate:this.handleDate(receptionReport.measurmentDate),
      salesId:receptionReport.salesId,
      kitchenLocation:receptionReport.kitchenLocation,
      fileDate:this.handleDate(receptionReport.fileDate),
      kitchenModelId:receptionReport.kitchecnModelId,
      clientNeed:receptionReport.clientNeed,
      AmORPm:res.data.actionByHour>12?1:0,

    })
    this.clientForm.patchValue({
      clientId:receptionReport.client.clientId,
      phoneNumber:receptionReport.client.mobile,
      clientAdress:receptionReport.client.clientAddress
    })


  })
}
handleDate(date:any){
  let year, month, day;
   let Fdate = new Date(date).toLocaleString().split(',')[0]
  year = Fdate.split('/')[2]
  month = Fdate.split('/')[0]
  day = Fdate.split('/')[1]
  let newDate = (year)+'-'+(+month < 10 ? '0'+month : month )+'-'+(+day < 10 ? '0'+day : day )
  return newDate;
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
}}





