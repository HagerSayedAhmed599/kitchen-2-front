import { AccordionModule } from '@coreui/angular';
import { Component, OnInit, HostListener } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ContractService } from '../contract.service';
import { ClientsService } from '../../clients/clients.service';
import { Clients, DataClients } from '../../clients/modal/clients';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss'],
})
export class ContractFormComponent implements OnInit {
  AddClientFileForm!: FormGroup;
  allClients: DataClients[] = [];
  weeks: any = [];
  months: any = [];
  myArray2: any = [];
  fileTypeId: any;
  newLoadPriceOffer: any = [];
  clientFileId: any;
  checkValue: boolean = false;
  clientFileTypes: any = [
    {
      name: 'المطابخ',
      id: 1,
    },
    // {
    //   name: 'الابواب',
    //   id: 2
    // },
    // {
    //   name: 'خزائن الحائط',
    //   id: 4
    // },
    // {
    //   name: 'الاعمال الخشبية',
    //   id: 6
    // },
  ];
  loadPriceOffer: any;
  loadPriceOfferList: any[] = [];

  constructor(
    private _FormBuilder: FormBuilder,
    private _contractService: ContractService,
    private _ClientsService: ClientsService,
    private _activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private _Router: Router
  ) {
    this.AddClientFileForm = this.initClientFileForm();
    for (let i = 1; 5 > i; i++) {
      this.weeks.push({ id: i });
    }
    for (let i = 1; 13 > i; i++) {
      this.months.push({ id: i });
    }
    // this.LoadPriceOffer();
    this.GetAllClients();
    let fileTypeId: any =
      _activatedRoute.snapshot.queryParamMap.get('fileTypeId');
    let clientFileId: any =
      _activatedRoute.snapshot.queryParamMap.get('clientFileId');
    this.fileTypeId = +fileTypeId;
    this.clientFileId = +clientFileId;
    if (fileTypeId) {
      this.AddClientFileForm.patchValue({
        fileTypeId: +fileTypeId,
      });
    }
    this.GetClientFileById();
  }

  initClientFileForm(): FormGroup {
    return this._FormBuilder.group({
      clientId: [null, [Validators.required]],
      // contractDate: [this.handleDate(Date.now()), [Validators.required]],
      contractDate: [this.handleDate(new Date()), [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      address: [null, [Validators.required]],
      nationalid: [null, [Validators.required]],
      AllPrice: [null, [Validators.required]],
      contaract: [null, [Validators.required]],
      beformaking: [null, [Validators.required]],
      week: [null, [Validators.required]],
      finish: [null, [Validators.required]],
      withTax: [0, [Validators.required]],
      clientFileConvertedId: [0, [Validators.required]],
      // contractStatusId: [0, [Validators.required]],
      // startWeek: [null, [Validators.required]],
      // startMonth: [null, [Validators.required]],
      // invoiceDate: [this.handleDate(Date.now()), [Validators.required]],
      // withTax: [0, [Validators.required]],
      // fileTypeId: [null, [Validators.required]],
      // notes: [null, [Validators.required]],
      // items: this._FormBuilder.array([]),
    });
  }
  // handleDate(date:any){
  //   let year, month, day;
  //    let Fdate = new Date(date).toLocaleString().split(',')[0]
  //   year = Fdate.split('/')[2]
  //   month = Fdate.split('/')[0]
  //   day = Fdate.split('/')[1]
  //   let newDate = (year)+'-'+(+month < 10 ? '0'+month : month )+'-'+(+day < 10 ? '0'+day : day )
  //   return newDate;
  // }

  handleDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Format to `YYYY-MM-DD` if you only need the date part
  }
  get itemsFormArray() {
    return this.AddClientFileForm.controls['items'] as FormArray;
  }
  addItemsFormArray() {
    this.itemsFormArray.push(this.ClientFileFormGroup());
  }
  logChange() {
    if (!this.checkValue) {
      this.AddClientFileForm.get('withTax')?.patchValue(0);
    } else {
      this.AddClientFileForm.get('withTax')?.patchValue(1);
    }
  }
  ClientFileFormGroup(): FormGroup {
    return this._FormBuilder.group({
      itemId: [null, [Validators.required]],
      itemTypeId: [4, [Validators.required]],
      categoryId: null,
    });
  }
  // LoadPriceOffer() {
  //   this._contractService.LoadPriceOffer().subscribe({
  //     next: (res: any) => {
  //       this.loadPriceOfferList = []
  //       this.loadPriceOffer = res.data
  //       Object.entries(res.data).forEach(([key, value], index) => {
  //         this.addItemsFormArray();
  //         this.loadPriceOfferList.push({
  //           key: key,
  //           defaultDesc: res.data[key]?.defaultDesc,
  //         })
  //         this.itemsFormArray.controls[index]?.patchValue({
  //           itemTypeId: 4,
  //           // categoryId: res.data[key]?.statusCategoryId,
  //         })
  //         if(this.clientFileId) this.newLoadPriceOffer.push(value)
  //       })
  //       if(this.clientFileId) this.GetClientFileById();
  //     }
  //   })
  // }

  GetAllClients() {
    this._ClientsService.GetAllClients().subscribe({
      next: (res: Clients) => {
        this.allClients = res.data;
      },
    });
  }

  ngOnInit(): void {}
  addContract() {
    // for (let i = 0; i < this.AddClientFileForm.value.items.length; i++) {

    //   if (this.AddClientFileForm.value.items[i].itemId==null){
    //       this.AddClientFileForm.value.items.shift(this.AddClientFileForm.value.items[i].itemId)
    //   }
    // }
    const formData = this.AddClientFileForm.value;

    // Convert specific fields to integers
    const transformedData = {
      ...formData,
      AllPrice: Number(formData.AllPrice),
      contaract: Number(formData.contaract),
      beformaking: Number(formData.beformaking),
      week: Number(formData.week),
      finish: Number(formData.finish),
      contractDate: new Date(formData.contractDate).toISOString(), // Convert to DateTime format
    };
    console.log('Transformed Data:', transformedData);

    const total =
      transformedData.contaract +
      transformedData.beformaking +
      transformedData.week;
    if (transformedData.AllPrice && total !== transformedData.AllPrice) {
      this.toastr.error(
        'مجموع القيم المدخلة يجب أن يكون مساويًا لقيمة العقد (عند توقيع العقد - قبل التصنيع - قبل التوريد والتركيب بأسبوع)'
      );
      return;
    }
    if (!transformedData.AllPrice) {
      transformedData.AllPrice = total;
    }

    this.AddClientFileForm.patchValue({
      AllPrice: transformedData.AllPrice,
    });
    console.log('Transformed Data111:', transformedData);

    if (!this.clientFileId) {
      this._contractService.AddContract(transformedData).subscribe({
        next: (res: any) => {
          this.toastr.success(`${res.message}`);
          this._Router.navigateByUrl('/contract');
        },
        error: (err: any) => {
          this.toastr.error(`${err.errors[0]}`);
        },
      });
    } else {
      this._contractService
        .EditClientFile(this.AddClientFileForm.value, this.clientFileId)
        .subscribe({
          next: (res: any) => {
            this.toastr.success(`${res.message}`);
            this._Router.navigateByUrl('/contract');
          },
          error: (err: any) => {
            this.toastr.error(`${err.errors[0]}`);
            // this._Router.navigateByUrl('/contract')
          },
        });
    }
  }
  setClient(e: any) {
    if (this.clientFileId) {
      console.log(e);
      this.AddClientFileForm.patchValue({
        phoneNumber: e.mobile,
        address: e.email,
      });
    } else {
      this.AddClientFileForm.patchValue({
        phoneNumber: e.mobile,
        address: e.email,
      });
    }
  }
  GetClientFileById() {
    this._contractService.GetClientFileByIdApi(this.clientFileId).subscribe({
      next: (res: any) => {
        console.log(res.data);
        let year, month, day;
        let contractDate = new Date(res.data.contractDate)
          .toLocaleString()
          .split(',')[0];
        year = contractDate.split('/')[2];
        month = contractDate.split('/')[0];
        day = contractDate.split('/')[1];
        let newContractDate =
          year +
          '-' +
          (+month < 10 ? '0' + month : month) +
          '-' +
          (+day < 10 ? '0' + day : day);
        console.log(newContractDate);
        let yearInvoice, monthInvoice, dayInvoice;
        let invoiceDate = new Date(res.data.contractDate)
          .toLocaleString()
          .split(',')[0];
        yearInvoice = invoiceDate.split('/')[2];
        monthInvoice = invoiceDate.split('/')[0];
        dayInvoice = invoiceDate.split('/')[1];
        let newInvoiceDate =
          yearInvoice +
          '-' +
          (+monthInvoice < 10 ? '0' + monthInvoice : monthInvoice) +
          '-' +
          (+dayInvoice < 10 ? '0' + dayInvoice : dayInvoice);
        console.log(newInvoiceDate);

        this.setClient(res?.data?.client?.clientId);
        let data = res.data;
        this.AddClientFileForm.patchValue({
          clientId: data.client?.clientId,
          contractDate: newContractDate,
          phoneNumber: data.client.mobile,
          address: data.client.email,
          nationalid: data.nationalid,
          AllPrice: data.allPrice,
          beformaking: data.beformaking,
          contaract: data.contaract,
          week: data.week,
          finish: data.finish,
          // contractStatusId: data.contractStatusId,
          // startWeek: data.startWeek,
          // startMonth: data.startMonth,
          // invoiceDate: newInvoiceDate,
          // withTax: data.withTax,
          // notes: data.notes,
        });
        // console.log(this.newLoadPriceOffer)
        data.withTax == 1
          ? (this.checkValue = true)
          : (this.checkValue = false);
        res.data.items.forEach((ele: any) => {
          let index = this.newLoadPriceOffer.findIndex(
            (secEle: any) => secEle?.statusCategoryId == ele?.parentCategoryId
          );
          if (index != -1) {
            this.itemsFormArray.controls[index]?.patchValue({
              itemId: ele.itemId,
              categoryId: ele.parentCategoryId,
              notes: ele.notes,
              itemPrice: ele.itemPrice,
              itemCount: ele.itemCount,
              itemTypeId: 4,
            });
          }
        });
      },
    });
  }
}
