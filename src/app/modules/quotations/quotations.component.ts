import {Component, OnInit} from '@angular/core';
import {QuotationsService} from './quotations.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import value from "*.json";
import {environment} from "../../../environments/environment";
import { ContractService } from '../contract/contract.service';
import { ProductionRequestsService } from '../production-requests/production-requests.service';
import { UsersService } from '../users/users.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class QuotationsComponent implements OnInit {
  Domain: any = environment.apiUrl;
  today: Date = new Date();
  allQuotations: any[] = [];
  MyDevices: any[] = [];
  statusCategoryById: any;
  statusCategoryById2: any;
  allUsersData: any;
  cities: any;
  DevicesData: any[]= [];
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
  SearchForm!:FormGroup;
  clientFileId: number = 0;
  statusId: number = 0;
  Note: String = '';
  query: any = {
    PageType: 0,
    fileTypeId: 1,
  }
  AddReceiveNotice!: FormGroup;
  dataToPatch:any[]=[];
  selectedOptions: any[] = [];
  Alldevices: any;
  pagesRoleToPatch:any[]=[];
  selectedPageOpions:any[]=[];
  buttons: any[]=[];
  BuildingData: any;
  ServicesData: any;
  paperData: any
  OrderData: any;
  isEditMode: boolean = false;
  isModalOpen: boolean = false;
  tableVisible = false;
  noteList: any[] = [];
  noteForm: FormGroup;
  currentNoteId: number | null = null;
  form: FormGroup;

  constructor(
    private _QuotationsService: QuotationsService,
    private _FormBuilder: FormBuilder,
    private toastr: ToastrService,
    private _productionRequestsService:ProductionRequestsService,
    private _ConttactService:ContractService,
    private userService:UsersService
  ) {
    this.AddReceiveNotice = this.initReceiveNoticeForm();
    this.SearchForm=this.initSearchForm();
    this.noteForm = this._FormBuilder.group({
      note1: ['', Validators.required],
      clientFileId: [0]
    });
    this.form = this._FormBuilder.group({
      cLientFileId: [''],
      notes: this._FormBuilder.array([]),
      unfinishedWorks: this._FormBuilder.array([]), // إعداد FormArray للحقل الديناميكي
    });
  }

  get unfinishedWorks(): FormArray {
    return this.form.get('unfinishedWorks') as FormArray;
  }
  get notes(): FormArray {
    return this.form.get('notes') as FormArray;
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
      measurmentDate: [null, [Validators.required]],////
      kitchenModelId: [null, [Validators.required]],////
      kitchenLocation: [null, [Validators.required]],///
      salesId: [null, [Validators.required]],//
      selectedDevice: [null, [Validators.required]],//
      AmORPm:[0,[Validators.required]],
      devices: this._FormBuilder.array([]),
    })
  }
  initSearchForm():FormGroup{
    return this._FormBuilder.group({
      clientName:[null],
      fileTypeId:[1],
      finalStatusId:[null],
      userId:[null],
      PageType:[0]
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
  Filter(){
    this.GetShortClientFiles();
  }

  ngOnInit(): void {
    this.GetShortClientFiles();
    this.GetStatusCategoryById();
    this.GetPermissionsOfRole(1);
    this.getDevices()
    this.GetLoadFinalStatusList()
    this.GetAllUsers();
    this.GetBuildingData();
    this.GetServicesData();
    this.GetOrderData();
    this.GetPaperData();
    console.log(this.device)
  }
  getDevices(){
    this._ConttactService.GetStatusCategoryById(19).subscribe(res=>{
      this.DevicesData=res.data.statuses
      console.log(this.DevicesData);

    })
  }
  getReciveNotice(id:any){
    this.AddReceiveNotice.reset();
    this._productionRequestsService.getReciveNotce(id).subscribe({
      next:(res:any)=>{
          console.log(res.data);

          this.dataToPatch = res.data==null?[]:res.data.devices;
          this.selectedOptions=[]; // Replace this with actual data
          if(this.dataToPatch.length!=0){
            this.dataToPatch.forEach(device=>{
              this.selectedOptions.push(device.id)
            })
          }

        //statusCategoryById2.log("dataToPatchk",this.MyDevices);

        this.AddReceiveNotice.patchValue({
          salesId : res.data?.salesId,
          fileDate:this.dateformat(res.data.fileDate),
          kitchenLocation:res.data.kitchenLocation,
          kitchenModelId:res.data.kitchecnModelId,
          measurmentId:parseInt(res.data.measurmentid),
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
    console.log(this.SearchForm.value);

    this._QuotationsService.GetShortClientFiles(this.SearchForm.value).subscribe({
      next: (res: any) => {
        this.allQuotations = res.data
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
  GetBuildingData() {
    this._QuotationsService.GetAllBuildingData(309).subscribe(data => {
      this.BuildingData = data.data.statuses
    })
  }
  GetOrderData() {
    this._QuotationsService.GetAllOrderData(310).subscribe(data => {
      this.OrderData = data.data.statuses
    })
  }
  GetServicesData() {
    this._QuotationsService.GetAllServicesData(311).subscribe(data => {
      this.ServicesData = data.data.statuses
    })
  }

  GetPaperData() {
    this._QuotationsService.GetAllPaperData(313).subscribe(data => {
      this.paperData = data.data.statuses
      this.unfinishedWorks.clear();

      // تعبئة الـ FormArray ببيانات ديناميكية
      this.paperData.forEach((paper) => {
        this.unfinishedWorks.push(
          this._FormBuilder.group({
            statusId: [paper.statusId || 0],
            isReady: [],
            note: [''],
            clientFileId: [0],
          })
        );
      });
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = {
        clientFileId: this.form.get('clientFileId')?.value || this.clientFileId,
        notes: this.form.get('notes')?.value, // Fetches notes from FormArray
        unfinishedWorks: this.form.get('unfinishedWorks')?.value // Fetches unfinished works
      };

      this._QuotationsService.addTashyk(formData).subscribe({
        next: (res: any) => {
          this.toastr.success(`${res.message}`);
          console.log('Data sent successfully:', res);
        },
        error: (err: any) => {
          console.error('Error sending data:', err); // Changed 'error' to 'err' here to match the parameter name
        }
      });
    }
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
        value['clientFileId'] = "";
        value['statusId'] = "";

        this.GetAllClientFileAttachment()
        this.GetShortClientFiles();
      }, error: (err: any) => {
        this.toastr.error(`${err.message}`);
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
        value['clientFileId'] = ""
        value['finalStatusId'] = ""
        value['notes'] = ""
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
        console.log(this.allClientFileAttachment);

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
  GetAllClientNotice(data: any) {
    this.clientData = data.client
    console.log('Data',data);

    this.GetAllUsers()
    this.GetStatusCategoryById2()
    this.getReciveNotice(data.clientFileId)
  }

  // AddDevice() {
  //   this.MyDevices.push(
  //     this.DevicesData.filter((ele: any) => ele.statusId === this.AddReceiveNotice.get('selectedDevice')?.value)[0]
  //   )
  //   console.log(this.MyDevices)
  //   this.devices?.value.push(
  //     {deviceId: this.AddReceiveNotice.get('selectedDevice')?.value}
  //   )
  // }

  AddClientFileFollowUp() {
    let value: any = {};
    value['Id'] = this.clientFileId;
    value['Attachment'] = this.uploadedImg[0];
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
        this.AddReceiveNotice.get('measurmentId')?.patchValue(parseInt(measermentID));
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
    this.statusId=0;
        this.Note="";
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

   // Add a new note
   addNote() {
    if (this.noteForm.valid) {
      const newNote = {
        id: 0,
        clientFileId: 0,
        text: this.noteForm.get('note1')?.value || '',
      };

      // إضافة الملاحظة إلى الملاحظات في FormArray
      this.notes.push(this._FormBuilder.group({
        id: [newNote.id], // يمكنك تخزين الـ ID هنا إذا كنت تحتاجه
        clientFileId: [newNote.clientFileId],
        note1: [newNote.text] // تخزين نص الملاحظة
      }));

      this.noteList.push(newNote); // إذا كنت ترغب في الحفاظ على الملاحظات في قائمة
      this.noteForm.reset();
      this.tableVisible = true;
    }
  }

  // Edit an existing note
  editNote(note: any) {
    this.isEditMode = true;
    this.currentNoteId = note.id;
    this.noteForm.patchValue({ note1: note.text });
  }

  // Update the note after editing
  updateNote() {
    if (this.noteForm.valid && this.currentNoteId !== null) {
      const index = this.noteList.findIndex(note => note.id === this.currentNoteId);
      if (index !== -1) {
        this.noteList[index].text = this.noteForm.get('note1')?.value || '';

        // تحديث الملاحظة في FormArray
        const noteFormGroup = this.notes.at(index) as FormGroup;
        noteFormGroup.patchValue({ note: this.noteForm.get('note1')?.value || '' });
      }
      this.cancelEdit();
    }
  }

  // Delete a note
  deleteNote(noteId: number) {
    this.noteList = this.noteList.filter(note => note.id !== noteId);
    this.notes.removeAt(this.notes.controls.findIndex(n => n.value.id === noteId)); // حذف الملاحظة من FormArray
    if (this.noteList.length === 0) {
      this.tableVisible = false;
    }
  }

  // Cancel edit mode
  cancelEdit() {
    this.isEditMode = false;
    this.currentNoteId = null;
    this.noteForm.reset();
  }
  closeModal() {
    this.isModalOpen = false;
  }

}
