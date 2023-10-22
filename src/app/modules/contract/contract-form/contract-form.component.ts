import {Component, OnInit, HostListener} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ContractService} from '../contract.service';
import {ClientsService} from '../../clients/clients.service';
import {Clients, DataClients} from '../../clients/modal/clients';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss']
})
export class ContractFormComponent implements OnInit {

  AddClientFileForm!: FormGroup;
  allClients: DataClients[] = [];
  myArray1: any = [];
  myArray2: any = [];
  myArrayAsForm1: any = [];
  myArrayAsForm2: any = [];
  myViewArray1: any = [];
  fileTypeId: any;
  clientFileId: any;
  myViewArray2: any = [];
  unitsCounts: number = 0;
  accessoriesCount: number = 0;
  TopCount: number = 0;
  ListOfItems: any = [
    {
      name: 'الخشب الداخلي',
      value: 'innerWood',
      statusCategoryId: 4,
    },
    {
      name: 'Front Type',
      value: 'shutterWood',
      itemTypeId: 4,
      id: 12
    },
    {
      name: 'البانيل',
      value: 'panel',
      itemTypeId: 4,
      id: 15
    },
    {
      name: 'حفرة المجلى',
      value: 'maglaHole',
      itemTypeId: 4,
      id: 13
    },
    {
      name: 'تصفيح الجدران من التوب',
      value: 'platingTopWall',
      itemTypeId: 4,
      id: 227
    },
    {
      name: 'سترب خارجي',
      value: 'outerStrop',
      itemTypeId: 4,
      id: 83
    },
    {
      name: 'نوع الايادي',
      value: 'handType',
      itemTypeId: 4,
      id: 9
    },
    {
      name: 'الشفاط',
      value: 'shafat',
      itemTypeId: 4,
      id: 23
    },
    {
      name: 'تسميك التوب',
      value: 'thickeningTop',
      itemTypeId: 4,
      id: 276
    },
    {
      name: 'البطارية',
      value: 'batery',
      itemTypeId: 4,
      id: 14
    },
    {
      name: 'الكورنيش',
      value: 'corniche',
      itemTypeId: 4,
      id: 178
    },
    {
      name: 'توصيلات صحية',
      value: 'healthLinking',
      itemTypeId: 4,
      id: 274
    },
    {
      name: 'الانارة',
      value: 'lighting',
      itemTypeId: 4,
      id: 275
    },
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
  ]
  loadPriceOffer: any;
  UnitsItemsbyCategory: any;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    this.countTotal()
  }

  countTotal() {
    let count = 0;
    for (let i = 0; i < this.itemsFormArray.controls.length; i++) {
      count += this.itemsFormArray.controls[i]?.get('itemPrice')?.value
    }
    this.TopCount = count
    let count1 = 0;
    for (let i = 0; i < this.myArrayAsForm1.length; i++) {
      count1 += this.myArrayAsForm1[i]?.get('itemPrice')?.value
    }
    this.unitsCounts = count1
    let count2 = 0;
    for (let i = 0; i < this.myArrayAsForm2.length; i++) {
      count2 += this.myArrayAsForm2[i]?.get('itemPrice')?.value
    }
    this.accessoriesCount = count2
  }

  constructor(
    private _FormBuilder: FormBuilder,
    private _contractService: ContractService,
    private _ClientsService: ClientsService,
    private _activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private _Router: Router
  ) {
    this.AddClientFileForm = this.initClientFileForm();

    this.LoadPriceOffer();
    this.GetUnitsItemsbyCategory();
    this.GetAllClients();
    let fileTypeId: any = _activatedRoute.snapshot.queryParamMap.get('fileTypeId')
    let clientFileId: any = _activatedRoute.snapshot.queryParamMap.get('clientFileId')
    this.fileTypeId = +fileTypeId
    this.clientFileId = +clientFileId
    if (fileTypeId) {
      this.AddClientFileForm.patchValue({
        fileTypeId: +fileTypeId
      });
    }
  }

  GetClientFileById(id: number) {
    this._contractService.GetClientFileByIdApi(id).subscribe({
      next: (res: any) => {
        this.AddClientFileForm.patchValue({
          clientId: res.data.client.clientId,
          deviceNotes: res.data.deviceNotes,
          additionaldiscount: res.data.additionaldiscount,
          discount: res.data.discount,
          accessoryDiscount: res.data.accessoryDiscount,
        });
        res.data.items.forEach((ele: any) => {
          if (ele.itemTypeId == 4) {
            let index = this.ListOfItems.findIndex((secEle: any) => secEle.id == ele.parentCategoryId)
            this.itemsFormArray.controls[index].patchValue({
              itemId: ele.itemId,
              categoryId: ele.parentCategoryId,
              notes: ele.notes,
              itemPrice: ele.itemPrice,
              itemCount: ele.itemCount,
              itemTypeId: 4,
            })
          } else if (ele.itemTypeId == 1) {
            this.myArrayAsForm1.push(
              this._FormBuilder.group({
                itemId: ele.itemId,
                itemCount: ele.itemCount,
                itemTypeId: 3,
                itemPrice: ele.itemPrice,
                notes: ele.notes,
                categoryId: ele.parentCategoryId
              })
            )
            this.myArray1.push({
              itemId: ele.itemId,
              itemCount: ele.itemCount,
              itemTypeId: 3,
              itemPrice: ele.itemPrice,
              notes: ele.notes,
              categoryId: ele.parentCategoryId,
              unit: this.loadPriceOffer['unites']?.statuses.filter((item: any) => item.statusId == ele.itemId,)[0]?.description,
              unit2: this.UnitsItemsbyCategory?.statuses.filter((item: any) => item.statusId == ele.categoryId,)[0]?.description,
            })
          } else if (ele.itemTypeId == 3) {
            this.myArrayAsForm2.push(
              this._FormBuilder.group({
                itemId: ele.itemId,
                itemCount: ele.itemCount,
                itemTypeId: 3,
                itemPrice: ele.itemPrice,
                notes: ele.notes,
                categoryId: ele.parentCategoryId
              })
            )
            this.myArray2.push({
              itemId: ele.itemId,
              itemCount: ele.itemCount,
              itemTypeId: 3,
              itemPrice: ele.itemPrice,
              notes: ele.notes,
              categoryId: ele.parentCategoryId,
              unit: this.loadPriceOffer['accessories']?.statuses.filter((item: any) => item.statusId == ele.itemId,)[0]?.description,
            })
          }
        })
        this.countTotal()
      }
    })
  }

  initClientFileForm(): FormGroup {
    return this._FormBuilder.group({
      clientId: [null, [Validators.required]],
      deviceNotes: ['', [Validators.required]],
      fileTypeId: [null, [Validators.required]],
      additionaldiscount: [null, [Validators.required]],
      discount: [null, [Validators.required]],
      accessoryDiscount: [null, [Validators.required]],
      items: this._FormBuilder.array([]),
    })
  }

  ClientFileFormGroup(): FormGroup {
    return this._FormBuilder.group({
      itemId: [null, [Validators.required]],
      itemCount: [1, [Validators.required]],
      itemTypeId: [4, [Validators.required]],
      itemPrice: [null],
      eachItemPrice: [null],
      notes: [null],
      categoryId: null
    })
  }

  setPrice(e: any, i: number) {
    let price = 0
    price = this.loadPriceOffer[this.ListOfItems[i].value]?.statuses.filter((ele: any) => ele.statusId == e.target.value)[0].price
    this.itemsFormArray.controls[i]?.get('eachItemPrice')?.patchValue(price)
  }

  getPrice(i: number) {
    let totPrice = 0
    totPrice = (this.itemsFormArray.controls[i]?.get('eachItemPrice')?.value * this.itemsFormArray.controls[i]?.get('itemCount')?.value)
    this.itemsFormArray.controls[i]?.get('itemPrice')?.patchValue(totPrice)
    // let count = 0
    // for (let i = 0 ; i < this.itemsFormArray.controls.length; i++){
    //   count += this.itemsFormArray.controls[i].get('itemPrice')?.value
    // }
  }

  setPrice1(e: any) {
    let price = 0
    price = this.loadPriceOffer['unites']?.statuses.filter((ele: any) => ele.statusId == e.target.value)[0].price
    this.items1Form.get('eachItemPrice')?.patchValue(price)
  }

  getPrice1() {
    let totPrice = 0
    totPrice = (this.items1Form.get('eachItemPrice')?.value * this.items1Form.get('itemCount')?.value)
    this.items1Form.get('itemPrice')?.patchValue(totPrice)
  }

  setPrice2(e: any) {
    let price = 0
    price = this.loadPriceOffer['accessories']?.statuses.filter((ele: any) => ele.statusId == e.target.value)[0].price
    this.items2Form.get('eachItemPrice')?.patchValue(price)
  }

  getPrice2() {
    let totPrice = 0
    totPrice = (this.items2Form.get('eachItemPrice')?.value * this.items2Form.get('itemCount')?.value)
    this.items2Form.get('itemPrice')?.patchValue(totPrice)
  }

  addUnitItem() {
    this.myArrayAsForm1.push(this.items1Form)
    this.myArray1.push({
      itemId: this.items1Form.get('itemId')?.value,
      itemCount: this.items1Form.get('itemCount')?.value,
      itemTypeId: this.items1Form.get('itemTypeId')?.value,
      itemPrice: this.items1Form.get('itemPrice')?.value,
      eachItemPrice: this.items1Form.get('eachItemPrice')?.value,
      notes: this.items1Form.get('notes')?.value,
      categoryId: this.items1Form.get('categoryId')?.value,
      unit: this.loadPriceOffer['unites']?.statuses.filter((item: any) => item.statusId == this.items1Form.get('itemId')?.value,)[0]?.description,
      unit2: this.UnitsItemsbyCategory?.statuses.filter((item: any) => item.statusId == this.items1Form.get('categoryId')?.value,)[0]?.description,
    })
  }

  addAccessoriesItem() {
    this.myArrayAsForm2.push(this.items2Form)
    this.myArray2.push({
      itemId: this.items2Form.get('itemId')?.value,
      itemCount: this.items2Form.get('itemCount')?.value,
      itemTypeId: this.items2Form.get('itemTypeId')?.value,
      itemPrice: this.items2Form.get('itemPrice')?.value,
      eachItemPrice: this.items2Form.get('eachItemPrice')?.value,
      notes: this.items2Form.get('notes')?.value,
      categoryId: this.items2Form.get('categoryId')?.value,
      unit: this.loadPriceOffer['accessories']?.statuses.filter((item: any) => item.statusId == this.items2Form.get('itemId')?.value)[0]?.description,
    })
  }

  get itemsFormArray() {
    return this.AddClientFileForm.controls["items"] as FormArray;
  }

  get items1Form() {
    return this.AddClientFileForm.controls["items1"]
  }

  get items2Form() {
    return this.AddClientFileForm.controls["items2"]
  }

  addItemsFormArray() {
    this.itemsFormArray.push(this.ClientFileFormGroup());
  }

  deleteItemsFormArray(index: number) {
    this.itemsFormArray.removeAt(index);
  }

  deleteUnits(index: number) {
    this.myArrayAsForm1.splice(index, 1);
    this.myArray1.splice(index, 1);
    this.myViewArray1.splice(index, 1);

  }

  deleteAccessories(index: number) {
    this.myArrayAsForm2.splice(index, 1);
    this.myArray2.splice(index, 1);
    this.myViewArray2.splice(index, 1);

  }

  LoadPriceOffer() {
    this._contractService.LoadPriceOffer().subscribe({
      next: (res: any) => {
        Object.entries(res.data).forEach(([key, value]) => {
          this.addItemsFormArray();
          // console.log(`Key: ${key}, Value: ${value}`);
          console.log(value);
          // this.itemsFormArray.controls[index].patchValue({
          //   itemTypeId: ele.itemTypeId
          // })
        })
        this.loadPriceOffer = res.data
        console.log(this.loadPriceOffer)
        if (this.clientFileId) {
          this.GetClientFileById(this.clientFileId)
        }
      }
    })
  }

  GetUnitsItemsbyCategory() {
    this._contractService.GetUnitsItemsbyCategory().subscribe({
      next: (res: any) => {
        this.UnitsItemsbyCategory = res.data
      }
    })
  }

  GetAllClients() {
    this._ClientsService.GetAllClients().subscribe({
      next: (res: Clients) => {
        this.allClients = res.data
      }
    })
  }

  ngOnInit(): void {

  }

  AddClientFile() {
    for (let i = 0; i < this.myArrayAsForm1.length; i++) {
      this.itemsFormArray.push(this.myArrayAsForm1[i])
    }
    for (let i = 0; i < this.myArrayAsForm2.length; i++) {
      this.itemsFormArray.push(this.myArrayAsForm2[i])
    }
    if (!this.clientFileId) {
      this._contractService.AddClientFile(this.AddClientFileForm.value).subscribe({
        next: (res: any) => {
          this.toastr.success(`${res.message}`);
          this._Router.navigateByUrl('/quotations')
        }, error: (err: any) => {
          this.toastr.error(`${err.message}`);
        }
      })
    } else {
      this._contractService.EditClientFile(this.AddClientFileForm.value, this.clientFileId).subscribe({
        next: (res: any) => {
          this.toastr.success(`${res.message}`);
          this._Router.navigateByUrl('/quotations')
        }, error: (err: any) => {
          this.toastr.error(`${err.message}`);
        }
      })
    }
  }
}
