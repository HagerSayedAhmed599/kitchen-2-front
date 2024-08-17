import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../clients/clients.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Clients } from '../../clients/modal/clients';
import { ActivatedRoute, Router } from '@angular/router';
import { TopService } from '../top.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-top',
  templateUrl: './form-top.component.html',
  styleUrls: ['./form-top.component.scss']
})
export class FormTopComponent implements OnInit {
  clientFileId :any;
  clientForm!: FormGroup;
  deviceForm!:FormGroup;
  allClients : any[]=[];
  allClientFileNO : any[]=[];
  allTopLists:any;
  AddTopForm!:FormGroup;
  clientId:any;
  types: any;
  viewImg: any[] = [];
  uploadedImg: any[] = [];
  AddedDevices: any[] = [];
  viewImageContent:any[] = [];
  viewUploadedImageContent:any[] = [];
  ShowImage: any;
  detailId: any ;
  constructor(private _ClientsService:ClientsService,
              private _FormBuilder: FormBuilder,
              private _activatedRoute:ActivatedRoute,
              private toastr: ToastrService,
              private topService:TopService ,
              private _Router:Router){
    this.clientForm=this.initClientForm()
    this.AddTopForm=this.initTopForm()
    this.deviceForm=this.initDeciveForm()
    this.clientFileId=this._activatedRoute.snapshot.queryParamMap.get('clientFileId')
    this.detailId=this._activatedRoute.snapshot.queryParamMap.get('detailId')
  }
  ngOnInit(): void {
    this.GetAllClients();
    this.LoadClientFileTopPage();
    this.GetTopById(this.detailId)
  }
  addTop(){
    console.log(this.AddTopForm.value);
    let data={
      fileNo :this.AddTopForm.get('FileNo')?.value,
      clientId :this.clientForm.get('clientId')?.value,
      typeId :this.AddTopForm.get('TypeId')?.value,
      topColor :this.AddTopForm.get('TopColor')?.value,
      panelTypeId :this.AddTopForm.get('PanelTypeId')?.value,
      topHieght :this.AddTopForm.get('TopHieght')?.value,
      sinkHoleId :this.AddTopForm.get('SinkHoleId')?.value,
      notes :this.AddTopForm.get('Notes')?.value,


    }
    if (this.detailId) {
      this.topService.UpdateTop(this.detailId,data).subscribe(res=>{
        this.toastr.success("added")
        this._Router.navigateByUrl('/top')
      },err=>{
        this.toastr.error("not")
      })
    }else{
      this.topService.AddTop(data).subscribe(res=>{
        this.toastr.success("added")
        this._Router.navigateByUrl('/top')
      },err=>{
        this.toastr.error("not")
      })
    }

  }
  getClientInfo(clientId:any){
    this.clientId=clientId;
    console.log(clientId);
if (clientId) {
 this._ClientsService.GetClient(clientId).subscribe((res:any)=>{
   console.log(res);

   this.clientForm.patchValue({

     phoneNumber:res.data[0].mobile,
     clientAdress:res.data[0].clientAddress
   })
this.GetFileNo(this.clientId);
 })
}
 }
 initClientForm():FormGroup{
  return this._FormBuilder.group({
    clientId: ['', [Validators.required]],
     phoneNumber: [null, [Validators.required]],
     clientAdress:[null,[Validators.required]]
  })
}
initDeciveForm():FormGroup{
  return this._FormBuilder.group({
    Width:['', [Validators.required]],
    Height:['', [Validators.required]],
    Length:['', [Validators.required]],
    Notes:['', [Validators.required]],
    AttachmentPath:['', [Validators.required]],

  })
}
initTopForm(){
  return this._FormBuilder.group({
    FileNo:['',[Validators.required]],
    ClientFileId:['',[Validators.required]],
    TypeId:['',[Validators.required]],
    TopColor:['',[Validators.required]],
    PanelTypeId:['',[Validators.required]],
    TopHieght:['',[Validators.required]],
    SinkHoleId:['',[Validators.required]],
    Notes:['',[Validators.required]],
  })
}
GetAllClients() {
  this._ClientsService.GetAllClients().subscribe({
    next: (res: Clients) => {
      this.allClients = res.data
    }
  })
}
GetFileNo(clientId:any){
  this.topService.getFileNumber(clientId).subscribe((res:any)=>{
     this.allClientFileNO=res.data
     console.log(this.allClientFileNO);

   })
}
GetClientFileId(FileNo:any){
this.topService.getClietFileId(this.clientId,FileNo).subscribe((res:any)=>{

  this.AddTopForm.patchValue({
    ClientFileId:res.data.clientFileId
  })
  //this.GetTopById(this.detailId)
})
}

LoadClientFileTopPage(){
  this.topService.LoadClientFileTopPage().subscribe((res:any)=>{
    console.log(res.data);
    this.allTopLists=res.data
  })
}
addDevice(){
this.AddedDevices.push(this.deviceForm.value)
let data = new FormData();
data.append('ClientFileTopId',this.detailId?.toString());
data.append('Width',this.deviceForm.get('Width')?.value);
data.append('Height',this.deviceForm.get('Height')?.value);
data.append('Length',this.deviceForm.get('Length')?.value);
data.append('Notes',this.deviceForm.get('Notes')?.value);
data.append('AttachmentPath',this.deviceForm.get('AttachmentPath')?.value);
this.topService.AddTopDevices(data).subscribe((res:any)=>{
console.log(res.errors);
this.GetTopById(this.detailId)
})
console.log(this.AddedDevices);
this.deviceForm.reset()
this.uploadedImg = []
this.viewImg = []
}
deleteDevice(index:any){
  this.AddedDevices.splice(index,1)
  console.log(this.AddedDevices);
}
onImageSelected(event: any): void {
  this.viewImg = []
  this.uploadedImg = []
  if (event.target.files && event.target.files[0]) {
    this.deviceForm.get('AttachmentPath')?.patchValue(event.target.files[0])
    const reader = new FileReader();
    this.uploadedImg.push(event.target.files.item(0));
    reader.onload = (event: any) => {
      this.viewImg.push(event.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  }
}
Getimage(index:any){
  let image =this.AddedDevices[index].AttachmentPath

const reader = new FileReader();
    this.viewUploadedImageContent.push(image);
    reader.onload = (event: any) => {
      this.viewImageContent.push(event.target.result);
      this.ShowImage=this.viewImageContent[index]
    };
    console.log(this.viewImageContent);

    reader.readAsDataURL(image);
}
GetTopById(id:any){
this.topService.GetTopById(id).subscribe({next:(res:any)=>{
console.log(res)
this.clientForm.patchValue({
  clientId:res.data.client.clientId,
  phoneNumber:res.data.client.mobile
})
this.AddTopForm.patchValue({

  ClientFileId:this.clientFileId,
  TypeId:res.data.typeId,
  TopColor:res.data.topColor,
  TopHieght:res.data.topHieght,
  SinkHoleId:res.data.sinkHoleId,
  PanelTypeId:res.data.panelTypeId,
  notes:res.data.notes
})
this.AddedDevices = res.data.devices
},error:(err:any)=>{
  console.log("Error",err)
}})
}
}
