import { ToastrService } from 'ngx-toastr';
import { QuotationsService } from '../quotations/quotations.service';
import { ReceptionReportService } from './reception-report.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsersService } from '../users/users.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  noteForm: FormGroup;
  isEditMode: boolean = false;
  form: FormGroup;
  notesData: any[]=[];
  paperData: any
  tableVisible = false;
  noteList: any[] = [];
  currentNoteId: number | null = null;
  isModalOpen: boolean = false;
  selectedOptions:any[]=[]
  constructor(private recptionReportService:ReceptionReportService,
              private _QuotationsService:QuotationsService,
              private toastr: ToastrService,
              private userService:UsersService,
              private _FormBuilder:FormBuilder) {
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
  ngOnInit(): void {
    this.getReceptionRports()
    this.GetStatusCategoryById()
    this.GetPermissionsOfRole(1)
    this.GetPaperData();
    if (this.clientFileId) {
      this.gettashykById(this.clientFileId);
    }
  }

  submit() {
    // const query = {
    //   ClientFileId: this.clientFileId,
    //   tostatus: 0,
    //   // isConfirmed: isConfirmed
    // };
    this.recptionReportService.sendConfirmation(this.clientFileId, 0).subscribe({
      next: (response) => {
        this.toastr.success(`${response.message}`);
        console.log('Response:', response);
      },
      error: (err) => {
        this.toastr.error(`${err.message}`);
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
  get unfinishedWorks(): FormArray {
    return this.form.get('unfinishedWorks') as FormArray;
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
      if (this.clientFileId) {
        this.gettashykById(this.clientFileId);
      }
    });
  }
  gettashykById(clientFileId: any) {
    this._QuotationsService.gettashyk(clientFileId).subscribe((res: any) => {
      let tashyk = res.data;
      this.notesData = res.data.notes;
      console.log(tashyk);
      console.log(this.notesData);

      this.notesData.forEach(notes => {
        this.selectedOptions.push(notes.id);
      });
      console.log(this.selectedOptions);

      this.form.patchValue({
        clientFileId: tashyk.cLientFileId
        // clientNeed: tashyk.clientNeed, // Update this line as needed
      });
      this.unfinishedWorks.clear(); // Clear current FormArray
    tashyk.unfinishedWorks.forEach(work => {
      this.unfinishedWorks.push(
        this._FormBuilder.group({
          statusId: [work.statusId || 0],
          isReady: [work.isReady],
          note: [work.note || ''],
          clientFileId: [tashyk.clientFileId],
        })
      );
    });
  });
}
get notes(): FormArray {
  return this.form.get('notes') as FormArray;
}
}
