import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Clients, DataClients } from '../../clients/modal/clients';
import { ClientsService } from '../../clients/clients.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-reception-report',
  templateUrl: './form-reception-report.component.html',
  styleUrls: ['./form-reception-report.component.scss']
})
export class FormReceptionReportComponent {
  clientFileId:any;
  AddClientFileForm!: FormGroup;
  fileTypeId: any;
  allClients: DataClients[] = [];
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
  ]
  devices :any=[
    {
      name:'Fridge 60',
      id:1
    },
    {
      name:'Fridge 90',
      id:1
    },
    {
      name:'Freezer 60',
      id:1
    },
    {
      name:'Freezer 90',
      id:1
    },
    {
      name:'Oven 60',
      id:1
    },
    {
      name:'Oven 90',
      id:1
    },
    {
      name:'Hop',
      id:1
    },
    {
      name:'Warming Drawer',
      id:1
    },
    {
      name:'Microwave',
      id:1
    },
    {
      name:'Cofee Maker',
      id:1
    },
    {
      name:'Cooler',
      id:1
    },
    {
      name:'Dish Washer',
      id:1
    },
    {
      name:'Washing Machine',
      id:1
    },

  ]
  constructor(private _FormBuilder: FormBuilder,
              private _ClientsService: ClientsService,
              private toastr: ToastrService,) {
    this.AddClientFileForm = this.initClientFileForm();
  }
  ngOnInit(): void {
    this.GetAllClients();
  }
  AddClientFile(){
    console.log("add");

  }
  GetAllClients() {
    this._ClientsService.GetAllClients().subscribe({
      next: (res: Clients) => {
        this.allClients = res.data
      }
    })
  }
  initClientFileForm(): FormGroup {
    return this._FormBuilder.group({
      clientId: [null, [Validators.required]],
      deviceNotes: ['', [Validators.required]],
      fileTypeId: [null, [Validators.required]],
      invoiceDate: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      address: [null, [Validators.required]],
      items: this._FormBuilder.array([]),
      items1: this._FormBuilder.group({
        itemId: [null, [Validators.required]],
        itemCount: [1, [Validators.required]],
        itemTypeId: [1, [Validators.required]],
        itemPrice: [null],
        eachItemPrice: [null],
        notes: [null],
        categoryId: null
      }),
      items2: this._FormBuilder.group({
        itemId: [null, [Validators.required]],
        itemCount: [1, [Validators.required]],
        itemTypeId: [3, [Validators.required]],
        itemPrice: [null],
        eachItemPrice: [null],
        notes: [null],
        categoryId: null
      })
    })
  }
}
