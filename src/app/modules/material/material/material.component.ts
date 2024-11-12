import { Component } from '@angular/core';
import { MaterialService } from '../material.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent {
  rating: any;
  units: any;
  origin: any;
  tax: any;
  materials: any[] = [];
  SearchForm: FormGroup;
  materialForm: FormGroup;
  itemId: number | null = null;
  constructor(private materialService: MaterialService,private fb: FormBuilder,private toastr: ToastrService) {
    this.materialForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      minItemAmount: ['', Validators.required],
      unit_id: ['', Validators.required],
      type: ['', Validators.required],
      tax: ['', Validators.required],
      country_id: ['', Validators.required],
      // iscount: ['', Validators.required],
    });
    this.SearchForm = this.fb.group({
      itemname: [null],
      itemno: [null],
      ItemCategoryID: [null]
    });
  }
  ngOnInit(): void {
    this.getAllRatingData();
    this.getAllUnitsData();
    this.getAllOriginData();
    this.getAllTaxData();
    this.GetAllMaterialData();
    }
    resetForm() {
      this.materialForm.reset();
      this.itemId = null;
    }
    onSubmit() {
      if (this.materialForm.valid) {
        const MaterialData = this.materialForm.value;

        if (this.itemId) {
          this.materialService.updateMaterial(this.itemId, this.materialForm.value).subscribe(
            (res: any) => {
              this.toastr.success(`${res.message}`);
              this.GetAllMaterialData();
              console.log('Supplier updated successfully');
            },
            (err) => {
              console.error('Error updating supplier:', err);
            }
          );
        } else {
          this.materialService.AddMaterial(MaterialData).subscribe(
            (res: any) => {
              this.toastr.success(`${res.message}`);
              this.GetAllMaterialData();
              console.log('Supplier added successfully');
              this.materialForm.reset();
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
    Filter(){
      this.GetAllMaterialData();
    }
    GetAllMaterialData() {
      console.log(this.SearchForm.value);

      this.materialService.GetAllMaterialData(this.SearchForm.value).subscribe({
        next: (res: any) => {
          this.materials = res.data
          console.log('mmm',this.materials);

        },
        error: (err: any) => {
          Object.entries(err.errors).forEach(([key, value]) => {
            // console.log(`Key: ${key}, Value: ${value}`);
            this.toastr.error(`${value}`);
          });
        }
      })
    }


    getMaterialById(id: number) {
      this.materialService.getMaterialById(id).subscribe((res: any) => {
        console.log(res);
        this.itemId = res.data.itemId;
        console.log(this.itemId);

        let materialData = res.data;
        console.log(materialData);

          this.materialForm.patchValue({
            name: materialData.itemName,
            price: materialData.singleItemCost,
            minItemAmount: materialData.minItemAmount,
            unit_id: materialData.unitId,
            type: materialData.itemCategoryId,
            tax: materialData.taxTypeId,
            country_id: materialData.countryId,
            // iscount: materialData.iscount,
            itemId: materialData.itemId
          });
        },
        (error) => {
          console.error('Error fetching supplier data:', error);
        }
      );
    }

    deleteMaterial() {
      this.materialService.DeleteMaterial(this.itemId).subscribe(
        (response: any) => {
          this.toastr.success(`${response.message}`);
          this.GetAllMaterialData();
          console.log('Client deleted successfully', response);
        },
        (error) => {
          console.error('Error deleting client:', error);
        }
      );
    }

    getAllRatingData() {
      this.materialService.GetAllRatingData(314).subscribe(data => {
        this.rating = data.data.statuses
      })
    }

  getAllUnitsData() {
    this.materialService.GetAllUnitsData(315).subscribe(data => {
      this.units = data.data.statuses
    })
  }

  getAllOriginData() {
    this.materialService.GetAllOriginData(317).subscribe(data => {
      this.origin = data.data.statuses
    })
  }

  getAllTaxData() {
    this.materialService.GetAllTaxData(318).subscribe(data => {
      this.tax = data.data.statuses
    })
  }
}
