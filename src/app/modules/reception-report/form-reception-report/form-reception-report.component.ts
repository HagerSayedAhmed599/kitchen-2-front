import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Clients, DataClients } from '../../clients/modal/clients';
import { ClientsService } from '../../clients/clients.service';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from '../../contract/contract.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceptionReportService } from '../reception-report.service';
import { take } from 'rxjs';
import { trigger, style, transition, animate } from '@angular/animations'; // استيراد الأنيميشن


@Component({
  selector: 'app-form-reception-report',
  templateUrl: './form-reception-report.component.html',
  styleUrls: ['./form-reception-report.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class FormReceptionReportComponent {
  clientFileId: any;
  AddClientFileForm!: FormGroup;
  clientForm!: FormGroup;
  editClientForm!: FormGroup
  clientList: any[] = [];
  selectedClientId: number | null = null;
  tableVisible = false;
  showModal = false;
  editMode = false;
  clientToEdit: any = null;
  fileTypeId: any;
  allClients: DataClients[] = [];
  selectedOptions: any[] = [];
  selectedServices:any[]=[];
  dataToPatch: any[] = [];
  isConfirmed: boolean = false;
  isEditMode: boolean = false
  AmOrPm: any = [
    { name: "AM", id: 0 },
    { name: "PM", id: 1 }
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
    { name: "في عهده الحارس", id: 1 },
    { name: " تصميم ", id: 2 },
    { name: " الترتيب مسبقا ", id: 3 },
    { name: "قياس  ", id: 4 },
    { name: "جاهز  ", id: 5 },
    { name: "تحت التشطيب  ", id: 6 },
    { name: "تحت الإنشاء  ", id: 7 },
  ];
  servicesData: any = [
    { name: " مطبخ ", id: 1 },
    { name: " مفروشات ", id: 2 },
    { name: " مغاسل ", id: 3 },
    { name: " غرفة غسيل ", id: 4 },
    { name: "خزائن حائط  ", id: 5 },
  ];
  orderData: any = [
    { name: " مناسب ", id: 1 },
    { name: " كاونتر ", id: 2 },
    { name: " امريكي ", id: 3 },
    { name: "  جزيرة وسطية ", id: 4 },
    { name: " ألماني  ", id: 5 },
    { name: " طاولة  ", id: 6 },

  ];

  KitchenType: any[] = []
  MyDevices: any[] = [];
  users: any;
  Alldevices: any;
  discreption: any;
  governorate: any;
  area: any;
  BuildingData: any;
  ServicesData: any;
  OrderData: any;
  constructor(private _FormBuilder: FormBuilder,
    private recptionReportService: ReceptionReportService,
    private _ClientsService: ClientsService,
    private toastr: ToastrService,
    private _Router: Router,
    private _activatedRoute: ActivatedRoute,
    private _ConttactService: ContractService) {
    this.clientFileId = this._activatedRoute.snapshot.queryParamMap.get('clientFileId')
    this.AddClientFileForm = this.initClientFileForm();
    this.clientForm = this.initClientForm()
  }
  ngOnInit(): void {
    // this.AddClientFileForm.get('AmORPm')?.patchValue(0);
    let fileTypeId: any = this._activatedRoute.snapshot.queryParamMap.get('fileTypeId')
    console.log(this.clientFileId);

    this.GetAllClients();
    this.GetDevices();
    this.GetKitchenType();
    this.getAllUsers();
    this.getAllDiscreption();
    this.getAllGovernorate();
    this.GetBuildingData();
    this.GetServicesData();
    this.GetOrderData();
    // this.getAllArea();
    if (this.clientFileId) {
      this.getReceptionReportById(this.clientFileId)
    }

    this.fileTypeId = +fileTypeId
    if (fileTypeId) {
      this.AddClientFileForm.patchValue({
        fileTypeId: +fileTypeId
      });
    }
  }

  AddClientFile() {
    console.log('form',this.AddClientFileForm.value);

    // this.AddClientFileForm.get('actionByHour')?.patchValue(this.AddClientFileForm.get('AmORPm')?.value == 0 ? this.AddClientFileForm.get('actionByHour')?.value : this.AddClientFileForm.get('actionByHour')?.value + 12)
    // let measermentID = this.AddClientFileForm.get('measurmentId')?.value
    // this.AddClientFileForm.get('measurmentId')?.patchValue(measermentID ? measermentID.toString() : '');
    // let val1, val2
    // val1 = this.AddClientFileForm.controls['measurmentId']?.value
    // val2 = val1.toString()
    // console.log(val2)
    if (this.clientFileId != null) {

      this.AddClientFileForm.get('clientFileId')?.patchValue(this.clientFileId)
    }

    // this.AddClientFileForm.patchValue({
    //   measurmentId: val2
    // })
    this.AddClientFileForm.patchValue({
      clientId: this.clientForm.get('clientId')?.value
    })
    console.log(this.AddClientFileForm.get('devices')?.value)
    // this.AddClientFileForm.get('devices')?.reset();
    const devicesArray = this.AddClientFileForm.get('devices') as FormArray;
    const servicesArray = this.AddClientFileForm.get('selectedService') as FormArray;
    this.selectedOptions.forEach(device => {

      devicesArray.push(
        this._FormBuilder.group({
          deviceId: [device, Validators.required],
        })
      )
    })
    this.selectedServices.forEach(service =>{
      servicesArray.push(
        this._FormBuilder.group({
          serviceId: [service, Validators.required],
    })
      )})
    // console.log(this.AddClientFileForm.value);

    const clientFileData = {
      clients: this.clientList.length > 0 ? this.clientList : [],
      clientFileId: this.clientFileId || 0,
      email: this.AddClientFileForm.get('email')?.value || "string",
      governorateId: this.AddClientFileForm.get('governorateId')?.value || 0,
      areaId: this.AddClientFileForm.get('areaId')?.value || 0,
      kitchenUsers: this.AddClientFileForm.get('kitchenUsers')?.value || 0,
      salesId: this.AddClientFileForm.get('salesId')?.value || 0,
      fileDate: this.AddClientFileForm.get('fileDate')?.value ? new Date(this.AddClientFileForm.get('fileDate')?.value).toISOString() : new Date().toISOString(),
      kitchenLocation: this.AddClientFileForm.get('kitchenLocation')?.value || "string",
      kitchenknow: this.AddClientFileForm.get('kitchenknow')?.value || "string",
      devices: devicesArray.value.length > 0 ? devicesArray.value : [],
      selectedService: servicesArray.value.length > 0 ? servicesArray.value : [],
      selectedBuilding: this.AddClientFileForm.get('selectedBuilding')?.value || 0,
      selectedOrder: this.AddClientFileForm.get('selectedOrder')?.value || 0,
      clientNeed: this.AddClientFileForm.get('clientNeed')?.value || "string"
    };

    console.log('Form Data:', clientFileData);

    this.recptionReportService.AddUpdatereceptionReport(clientFileData).subscribe(res => {
      this.toastr.success("added")
      this.getReceptionReportById(this.clientFileId)
      this._Router.navigateByUrl('/reception-report')
    }, err => {
      this.toastr.error(err.errors[0])
      this.AddClientFileForm.get('actionByHour')?.patchValue(this.AddClientFileForm.get('AmORPm')?.value == 0 ? this.AddClientFileForm.get('actionByHour')?.value : this.AddClientFileForm.get('actionByHour')?.value - 12)
    })


  }
  GetAllClients() {
    this._ClientsService.GetAllClients().subscribe({
      next: (res: Clients) => {
        this.allClients = res.data
      }
    })
  }
  getClientInfo(clientId: any) {

    console.log(clientId);
    if (clientId) {
      this._ClientsService.GetClient(clientId).subscribe((res: any) => {
        console.log(res);

        this.clientForm.patchValue({

          phoneNumber: res.data[0].mobile,
          clientAdress: res.data[0].clientAddress
        })
      })
    }
  }
  GetDevices() {
    this._ConttactService.GetStatusCategoryById(19).subscribe(res => {
      this.Alldevices = res.data.statuses
      console.log(this.Alldevices);

    })
  }


  GetBuildingData() {
    this.recptionReportService.GetAllBuildingData(309).subscribe(data => {
      this.BuildingData = data.data.statuses
    })
  }
  GetServicesData() {
    this.recptionReportService.GetAllServicesData(311).subscribe(data => {
      this.ServicesData = data.data.statuses
    })
  }
  GetOrderData() {
    this.recptionReportService.GetAllOrderData(310).subscribe(data => {
      this.OrderData = data.data.statuses
    })
  }
  GetKitchenType() {
    this._ConttactService.GetStatusCategoryById(18).subscribe(res => {
      this.KitchenType = res.data.statuses
    })
  }
  initClientForm(): FormGroup {
    return this._FormBuilder.group({
        // clientId: [null, [Validators.required]],
        phone: [null, [Validators.required]],
        wasf: [null, [Validators.required]],
        name: [null, [Validators.required]],
        // isconfirmed: [null, [Validators.required]],
        //  governorateId: [null,],
        //  clientAdress:[null,],
        //  email:[null,],
        //  areaId:[null,],
      //   kitchenLocation: [null, [Validators.required]],
      //   devices: this._FormBuilder.array([]),
      //  Services:this._FormBuilder.array([]),
      //  selectedBuilding: [null, [Validators.required]],
      // selectedService: [null, [Validators.required]],
      // kitchenUsers: [null, [Validators.required]],
    })
  }

  initClientFileForm(): FormGroup {
    return this._FormBuilder.group({
      // phone: [null, [Validators.required]],
      // wasf: [null, [Validators.required]],
      // isconfirmed: [null, [Validators.required]],
      // name: [null, [Validators.required]],
      governorateId: [null, [Validators.required]],
      email: [null, [Validators.required]],
      areaId: [null, [Validators.required]],
      salesId: [null, [Validators.required]],
      fileDate: [null, [Validators.required]],
      selectedDevice: [null, [Validators.required]],
      selectedBuilding: [null, [Validators.required]],
      service: [null, [Validators.required]],
      selectedOrder: [null, [Validators.required]],
      clientNeed: [null, Validators.required],
      kitchenLocation: [null, [Validators.required]],
      kitchenUsers: [null, [Validators.required]],
      kitchenknow: [null, [Validators.required]],
      clients: this._FormBuilder.array([]),
      devices: this._FormBuilder.array([]),
      selectedService:this._FormBuilder.array([])
    })
  }

  addClient() {
    if (this.clientForm.valid) {
      // const newClient = { ...this.clientForm.value, id: this.clientList.length + 1 };
      // this.clientList.push(newClient);
      // console.log(this.clientList);
      // if (this.selectedClientId === null) {
      //   this.selectedClientId = newClient.id;
      // }
      const newClient = {
        clientDetailsId: 0,
        name: this.clientForm.get('name')?.value,
        phone: this.clientForm.get('phone')?.value,
        isconfirmed: this.clientList.length === 0 ? true : false,
        wasf: this.clientForm.get('wasf')?.value,
        clientId: this.clientList.length + 1
      };
      this.clientList.push(newClient);
      console.log('Client added:', newClient);
    console.log('Current clients list:', this.clientList);
    if (this.selectedClientId === null) {
      this.selectedClientId = newClient.clientId;
    }
    if (this.clientList.length === 1) {
      this.selectedClientId = newClient.clientId;
    }
    // if (this.clientList.length === 0) {
      // }
      this.tableVisible = true;
      this.clientForm.reset();
      this.isConfirmed = false;
    }
  }

  generateClientId(): number {
    // Generate unique clientId based on existing list
    return this.clientList.length > 0 ? Math.max(...this.clientList.map(c => c.clientId)) + 1 : 1;
  }

  editClient(client: any) {
    this.clientToEdit = client;
    this.clientForm.patchValue(client);
    this.showModal = true;
    this.isEditMode = true;
  }

  updateClient() {
    if (this.clientForm.valid) {
      const index = this.clientList.findIndex((c) => c.clientId === this.clientToEdit.clientId);
      if (index > -1) {
        this.clientList[index] = { ...this.clientForm.value, clientId: this.clientToEdit.clientId };
      }
      this.clientForm.reset();
      this.isEditMode = false;
      this.showModal = false;
    }
  }

  removeClient(client: any) {
    const index = this.clientList.indexOf(client);
    if (index > -1) {
      this.clientList.splice(index, 1);
    }
    if (this.clientList.length === 0) {
      this.tableVisible = false;
      this.selectedClientId = null;
    } else if (this.selectedClientId === client.id) {
      this.selectedClientId = this.clientList[0].id;
    }
  }

  selectClient(id: number, confirmed: boolean) {
    this.selectedClientId = id;
    this.isConfirmed = confirmed;
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
  getAllUsers() {
    this._ConttactService.GetAllUsersApi().subscribe(res => {
      this.users = res.data
    })
  }

  getAllDiscreption() {
    this.recptionReportService.GetAllDiscreption(312).subscribe(data => {
      this.discreption = data.data.statuses
      console.log('mmm',this.discreption);

    })
  }

  getAllGovernorate() {
    this.recptionReportService.GetAllGovernorate(307).subscribe(data => {
      this.governorate = data.data.statuses;
      console.log('mmmmmmmmmmm',this.governorate);

    })
  }
  // getAllArea() {
  //   this.recptionReportService.GetAllArea(308).subscribe(data => {
  //     this.area = data.data.statuses
  //     console.log('mm99',this.area);

  //   })
  // }

  getAllArea(governorateId: number) {
    if (governorateId) {
      this.recptionReportService.GetAllArea(governorateId).subscribe(data => {
        console.log('Response from API:', data);
        this.area = data.data;
        console.log('All Areas', this.area);
      },error => {
        console.error('Error fetching areas:', error);
      });
    } else {
      this.area = [];
    }
  }

  isSelectedService(statusId:number):boolean{
    return this.selectedServices.includes(statusId)
  }
  isSelected(statusId: number): boolean {
    return this.selectedOptions.includes(statusId);
  }
  getReceptionReportById(clientFileId: any) {

    this.recptionReportService.GetReceptionReportById(clientFileId).subscribe((res: any) => {
      let receptionReport = res.data;
      this.dataToPatch = res.data.devices; // Replace this with actual data
      this.dataToPatch.forEach(device => {
        this.selectedOptions.push(device.id)
      })

      console.log(this.selectedOptions);


      this.AddClientFileForm.patchValue({
        // clientId:receptionReport
        // actionByHour: res.data.actionByHour > 12 ? res.data.actionByHour - 12 : res.data.actionByHour,
        // designerId: receptionReport.designerId,
        // designerDate: this.handleDate(receptionReport.designerDate),
        // measurmentId: receptionReport.measurmentid,
        // measurmentDate: this.handleDate(receptionReport.measurmentDate),
        salesId: receptionReport.salesId,
        kitchenLocation: receptionReport.kitchenLocation,
        fileDate: this.handleDate(receptionReport.fileDate),
        kitchenknow: receptionReport.howknow,
        kitchenUsers: receptionReport.kitchenUsers,
        adress: receptionReport.adress,
        service: receptionReport.services.id,
        selectedDevice: receptionReport.devices[0].id,
        selectedOrder: receptionReport.selectedOrderId,
        selectedBuilding: receptionReport.selectedBuildingId,
        governorateId: receptionReport.governorateId,
        areaId: receptionReport.areaId,
        email: receptionReport.client.email


        // kitchenModelId: receptionReport.kitchecnModelId,
        // clientNeed: receptionReport.clientNeed,
        // AmORPm: res.data.actionByHour > 12 ? 1 : 0,

      })
      this.clientForm.patchValue({
        clientId: receptionReport.client.clientId,
        wasf: receptionReport.client.wasf,
        phone: receptionReport.client.phone,
        name: receptionReport.client.clientName
        // phoneNumber: receptionReport.client.mobile,
        // clientAdress: receptionReport.client.clientAddress
      })


    })
  }
  handleDate(date: any) {
    let year, month, day;
    let Fdate = new Date(date).toLocaleString().split(',')[0]
    year = Fdate.split('/')[2]
    month = Fdate.split('/')[0]
    day = Fdate.split('/')[1]
    let newDate = (year) + '-' + (+month < 10 ? '0' + month : month) + '-' + (+day < 10 ? '0' + day : day)
    return newDate;
  }
  selectService(event:any, option:any){
    const isChecked = event.target.checked;
    if(isChecked){
      if (this.selectedServices.indexOf(option.statusId)===-1) {
        this.selectedServices.push(option.statusId);
      }
    }else{
      const index = this.selectedServices.indexOf(option.statusId);
      this.selectedServices.splice(index,1);
    }
    console.log('selected Devices',this.selectedServices)
  }
  selectOption(event: any, option: any) {
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
}





