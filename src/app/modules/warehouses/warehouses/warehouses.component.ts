import { Component, OnInit } from '@angular/core';
import { WarehousesService } from '../warehouses.service';
import { FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from '../../supplier/supplier.service';
import { MaterialService } from '../../material/material.service';

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})
export class WarehousesComponent implements OnInit{
  purchaseForm: FormGroup;
  isEditMode: boolean = false;
  tableVisible = false;
  itemsList: any[] = [];
  selectedItemId: number | null = null;
  itemToEdit: any = null;
  showModal = false;
  rating: any;
  addItemForm: FormGroup;
  SearchForm: FormGroup;
  warehouses: any[] = [];
  suppliers: any[] = [];
  materials: any[] = [];
  itemId: number | null = null;

  constructor(private warehousesService: WarehousesService, private fb: FormBuilder, private toastr: ToastrService,private supplierService: SupplierService, private materialService: MaterialService){
    this.purchaseForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      supplierName: [null, Validators.required],
      note: [''],
      items: this.fb.array([]) // to hold multiple items
    });
    this.addItemForm = this.fb.group({
      material: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      tax: ['', Validators.required],
      bonus: ['', Validators.required],
      discount: ['', Validators.required]
    });
    this.SearchForm = this.fb.group({
      itemname: [null],
      from: [null],
      to: [null]
    })

  }
  get items(): FormArray {
    return this.purchaseForm.get('items') as FormArray;
  }
  ngOnInit(): void {
    this.getAllRatingData();
    this.GetAllWarehousesData();
    this.GetAllSupplierData();
    this.GetAllMaterialData();
  }
  Filter() {
    this.GetAllWarehousesData();
  }
  GetAllWarehousesData() {
    console.log(this.SearchForm.value);
    this.warehousesService.GetAllWarehousesData(this.SearchForm.value).subscribe({
      next: (res: any) => {
        this.warehouses = res.data
        console.log(this.warehouses);
      },
      error: (err: any) => {
        Object.entries(err.errors).forEach(([key, value]) => {
          // console.log(`Key: ${key}, Value: ${value}`);
          this.toastr.error(`${value}`);
        });
      }
    })
  }
  GetAllSupplierData() {
    this.supplierService.GetAllSupplierData(this.SearchForm.value).subscribe({
      next: (res: any) => {
        this.suppliers = res.data
        console.log(this.suppliers);

      },
      error: (err: any) => {
        Object.entries(err.errors).forEach(([key, value]) => {
          // console.log(`Key: ${key}, Value: ${value}`);
          this.toastr.error(`${value}`);
        });
      }
    })
  }

  GetAllMaterialData() {
    console.log(this.SearchForm.value);

    this.materialService.GetAllMaterialData(this.SearchForm.value).subscribe({
      next: (res: any) => {
        this.materials = res.data
        console.log('mmm',this.materials);
        this.addItemForm.get('material')?.valueChanges.subscribe(selectedMaterialId => {
          const selectedMaterial = this.materials.find(mat => mat.itemId === selectedMaterialId);
          if (selectedMaterial) {
            // قم بملء الحقول بناءً على المادة المختارة
            this.addItemForm.patchValue({
              quantity: selectedMaterial.isCounted,
              price: selectedMaterial.minItemAmount,
              tax: selectedMaterial.tax,
              bonus: selectedMaterial.bonus,
              discount: selectedMaterial.discount
            });
          }
        });

      },
      error: (err: any) => {
        Object.entries(err.errors).forEach(([key, value]) => {
          // console.log(`Key: ${key}, Value: ${value}`);
          this.toastr.error(`${value}`);
        });
      }
    })
  }

  getSupplierById(id: number) {
    this.warehousesService.getWarehousesById(id).subscribe((res: any) => {
      console.log(res);
      this.itemId = res.data.inv_id;
      console.log(this.itemId);

      let warehousesData = res.data;
      console.log(warehousesData);

        this.purchaseForm.patchValue({
          invoiceNumber: warehousesData.invoiceNumber,
          invoiceDate: new Date(warehousesData.invoiceDate).toISOString().split('T')[0],
          supplierName: warehousesData.supplierName,
          note: warehousesData.note
        });
        this.addItemForm.patchValue({
          material: warehousesData.items.material,
          quantity: warehousesData.items.quantity,
          price: warehousesData.items.price,
          tax: warehousesData.items.tax,
          bonus: warehousesData.items.bonus,
          discount: warehousesData.items.discount
        })
      },
      (error) => {
        console.error('Error fetching supplier data:', error);
      }
    );
  }


  deleteWarehouses(id: number) {
    this.warehousesService.DeleteWarehouses(id).subscribe(
      (response: any) => {
        this.toastr.success(`${response.message}`);
        this.GetAllWarehousesData();
        console.log('Client deleted successfully', response);
      },
      (error) => {
        console.error('Error deleting client:', error);
      }
    );
  }
  getAllRatingData() {
    this.warehousesService.GetAllRatingData(314).subscribe(data => {
      this.rating = data.data.statuses
    })
  }
  resetForm() {
    this.purchaseForm.reset();
    this.itemId = null;
  }
  onSubmit() {
    console.log('form', this.purchaseForm.value);

    // تجهيز العناصر للـ FormArray
    const itemArray = this.purchaseForm.get('items') as FormArray;
    itemArray.clear();
    this.itemsList.forEach(item => {
      itemArray.push(
        this.fb.group({
          itemId: [item.itemId, Validators.required],
          material: [item.material, Validators.required],
          quantity: [item.quantity, Validators.required],
          price: [item.price, Validators.required],
          tax: [item.tax, Validators.required],
          bonus: [item.bonus, Validators.required],
          discount: [item.discount, Validators.required]
        })
      )
    });

    // تجهيز بيانات الشراء
    const purchaseData = {
      invoiceDate: this.purchaseForm.get('invoiceDate')?.value
        ? new Date(this.purchaseForm.get('invoiceDate')?.value).toISOString().substring(0, 10)
        : new Date().toISOString().substring(0, 10),
      invoiceNumber: this.purchaseForm.get('invoiceNumber')?.value || "string",
      supplierName: this.purchaseForm.get('supplierName')?.value || "string",
      note: this.purchaseForm.get('note')?.value || "string",
      items: itemArray.value
    };

    console.log('Form Data:', purchaseData);

    // التحقق من وجود itemId لتحديد ما إذا كان سيتم تنفيذ إضافة أو تحديث
    purchaseData.items.forEach((item: any) => {
      if (item.itemId) {
        // تنفيذ التحديث إذا كان itemId موجود
        this.warehousesService.updateWarehouses(item.itemId, this.purchaseForm.value).subscribe(
          res => {
            this.toastr.success("تم التحديث بنجاح");
            this.GetAllWarehousesData();
          },
          err => {
            this.toastr.error("خطأ في التحديث: " + err.errors[0]);
          }
        );
      } else {
        // تنفيذ الإضافة إذا كان itemId فارغ
        this.warehousesService.AddWarehouses(purchaseData).subscribe(
          res => {
            this.toastr.success("تمت الإضافة بنجاح");
            this.GetAllWarehousesData();
          },
          err => {
            this.toastr.error("خطأ في الإضافة: " + err.errors[0]);
          }
        );
      }
    });
  }


  addItem() {
    if (this.addItemForm.valid) {
      const newItem = {
        material: this.addItemForm.get('material')?.value,
        quantity: this.addItemForm.get('quantity')?.value,
        price: this.addItemForm.get('price')?.value,
        tax: this.addItemForm.get('tax')?.value,
        bonus: this.addItemForm.get('bonus')?.value,
        discount: this.addItemForm.get('discount')?.value,
        itemId: this.itemsList.length + 1
      };
      this.itemsList.push(newItem);
      console.log('Client added:', newItem);
    console.log('Current clients list:', this.itemsList);
    if (this.selectedItemId === null) {
      this.selectedItemId = newItem.itemId;
    }
    if (this.itemsList.length === 1) {
      this.selectedItemId = newItem.itemId;
    }
      this.tableVisible = true;
      this.addItemForm.reset();
    }
  }

  generateItemId(): number {
    // Generate unique clientId based on existing list
    return this.itemsList.length > 0 ? Math.max(...this.itemsList.map(c => c.clientId)) + 1 : 1;
  }

  editItem(item: any) {
    this.itemToEdit = item;
    this.addItemForm.patchValue(item);
    this.showModal = true;
    this.isEditMode = true;
  }

  updateItem() {
    if (this.addItemForm.valid) {
      const index = this.itemsList.findIndex((c) => c.itemId === this.itemToEdit.itemId);
      if (index > -1) {
        this.itemsList[index] = { ...this.addItemForm.value, itemId: this.itemToEdit.itemId };
      }
      this.addItemForm.reset();
      this.isEditMode = false;
      this.showModal = false;
    }
  }

  removeItem(item: any) {
    const index = this.itemsList.indexOf(item);
    if (index > -1) {
      this.itemsList.splice(index, 1);
    }
    if (this.itemsList.length === 0) {
      this.tableVisible = false;
      this.selectedItemId = null;
    } else if (this.selectedItemId === item.id) {
      this.selectedItemId = this.itemsList[0].id;
    }
  }

}
