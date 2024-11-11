import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../supplier.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit{
  supplierForm: FormGroup;
  isEditMode: boolean = false;
  suppliers: any[] = [];
  SearchForm:FormGroup;
  clientId: number;

  constructor(private supplierService: SupplierService,private fb: FormBuilder,    private toastr: ToastrService ){
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: [null, Validators.required],
    });
    this.SearchForm = this.fb.group({
      name: [null],
      phonenumber: [null],
    });
  }
  ngOnInit(): void {
    this.GetAllSupplierData();
  }
  Filter(){
    this.GetAllSupplierData();
  }
  GetAllSupplierData() {
    console.log(this.SearchForm.value);

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
  resetForm() {
    this.supplierForm.reset();
    this.clientId = null;
  }
  onSubmit() {
    if (this.supplierForm.valid) {
      const supplierData = this.supplierForm.value;

      if (this.clientId) {
        this.supplierService.updateSupplier(this.clientId, this.supplierForm.value).subscribe(
          (res: any) => {
            this.toastr.success(`${res.message}`);
            this.GetAllSupplierData();
            console.log('Supplier updated successfully');
          },
          (err) => {
            console.error('Error updating supplier:', err);
          }
        );
      } else {
        this.supplierService.AddSupllier(supplierData).subscribe(
          (res: any) => {
            this.toastr.success(`${res.message}`);
            this.GetAllSupplierData();
            console.log('Supplier added successfully');
            this.supplierForm.reset();
          },
          (err) => {
            console.error('Error adding supplier:', err);
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }

  getSupplierById(id: number) {
    this.supplierService.getSupplierById(id).subscribe((res: any) => {
      console.log(res);
      this.clientId = res.data.clientId;
      console.log(this.clientId);

      let supplierData = res.data;
      console.log(supplierData);

        this.supplierForm.patchValue({
          name: supplierData.clientName,
          phone: supplierData.clientPhone,
          address: supplierData.clientAddress,
          clientId: supplierData.clientId
        });
      },
      (error) => {
        console.error('Error fetching supplier data:', error);
      }
    );
  }

  deleteSupplier(id: number) {
    const token = 'YOUR_JWT_TOKEN_HERE';
    this.supplierService.DeleteSupplier(id).subscribe(
      (response: any) => {
        this.toastr.success(`${response.message}`);
        this.GetAllSupplierData();
        console.log('Client deleted successfully', response);
      },
      (error) => {
        console.error('Error deleting client:', error);
      }
    );
  }

}
