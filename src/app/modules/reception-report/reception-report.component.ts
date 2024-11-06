import { ToastrService } from 'ngx-toastr';
import { QuotationsService } from '../quotations/quotations.service';
import { ReceptionReportService } from './reception-report.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-reception-report',
  templateUrl: './reception-report.component.html',
  styleUrls: ['./reception-report.component.scss']
})
export class ReceptionReportComponent implements OnInit {
  query: any = {
    PageType: 0,
    fileTypeId: 1,
  }
  allReceptionReports: any;
  clientFileId: number = 0;
  statusId: number = 0;
  allClientFileAttachment: any[] = [];
  statusCategoryById: any;
  viewImg: any[] = [];
  uploadedImg: any[] = [];
  Domain: any = environment.apiUrl;
  LoadFinalStatusList: any[] = [];
  Note: String = '';
  AllFinalStatusClientFile: any[] = [];
  attatchmentvisible=false;
  statuesvisible=false;
  pagesRoleToPatch: any[] = [];
  selectedPageOpions: any[] = [];
  buttons: any[] = [];
  constructor(private recptionReportService:ReceptionReportService,
              private _QuotationsService:QuotationsService,
              private toastr: ToastrService,
              private userService:UsersService) { }
  ngOnInit(): void {
    this.getReceptionRports()
    this.GetStatusCategoryById()
    this.GetPermissionsOfRole(1)
  }

  submit() {
    // const query = {
    //   ClientFileId: this.clientFileId,
    //   tostatus: 0,
    //   // isConfirmed: isConfirmed
    // };
    this.recptionReportService.sendConfirmation(this.clientFileId, 0).subscribe({
      next: (response) => {
        this.toastr.success(response.message)
        console.log('Response:', response);
      },
      error: (err) => {
        this.toastr.error(err.message)
        console.error('Error:', err);
      },
    });
  }
  filter(event: any) {
    console.log(event.value);
    event.value ? this.query['fileTypeId'] = event.value : this.query['fileTypeId'] = null;
     this.getReceptionRports();
  }
  getReceptionRports(){
    this.recptionReportService.getReceptionReport().subscribe((res:any)=>{
      this.allReceptionReports=res.data
      console.log(res.data);

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
       // this.GetShortClientFiles();
      this.attatchmentvisible=false;
      }, error: (err: any) => {
        this.toastr.error(`${err.message}`);
        this.attatchmentvisible=true;
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
  GetStatusCategoryById() {
    this._QuotationsService.GetStatusCategoryById(100).subscribe({
      next: (res: any) => {
        this.statusCategoryById = res.data
        console.log()
        this.statusId = res.data.statuses[0].statusId
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
        this.getReceptionRports()
        this.statuesvisible=false;
      }, error: (err: any) => {
        this.toastr.error(`${err.message}`);
        this.statuesvisible=true;
      }
    })
  }
  GetAllFinalStatusClientFile() {
    this._QuotationsService.AllFinalStatusClientFile(this.clientFileId).subscribe({
      next: (res: any) => {
        console.log(res)
        this.AllFinalStatusClientFile  = res.data
        console.log('all final status',this.AllFinalStatusClientFile);

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
