import { Injectable } from '@angular/core';
import { INavData } from '@coreui/angular';
import { UsersService } from 'src/app/modules/users/users.service';


@Injectable({
  providedIn: 'root',
})
export class nav{

  pages :any[]=[];
  pagesToShow :any[]=[];
  pagesDescriptions :any[]=[];
  navItems: INavData[] = [];
  constructor(private _userService:UsersService) {
 this.navItems= [
      {
        name: 'الرئيسية',
        description: "",
        url: '/home',
        // iconComponent: { name: 'cil-speedometer' },
      },
      {
        name: 'العملاء',
        description: "1",
        url: '/clients',
        // iconComponent: { name: 'cil-speedometer' },
      },
      {
        name: 'عروض الاسعار',
        description: "عرض السعر",
        url: '/quotations',
        // iconComponent: { name: 'cil-speedometer' },
      },
      {
        name: 'العقد',
        description: "عقد",
        url: '/contract',
        // iconComponent: { name: 'cil-speedometer' },
      },
      {
        name: 'طلبات الانتاج',
        description:"طلب انتاج " ,
        url: '/production-requests',
        // iconComponent: { name: 'cil-speedometer' },
      },
      {
        name: 'المتابعات',
        description:"المتابعات" ,

        url: '/follows',
        // iconComponent: { name: 'cil-speedometer' },
      },
      // {
      //   name: 'الملاحظات',
      //   url: '/home',
      //   // iconComponent: { name: 'cil-speedometer' },
      // },

      {
        name: 'الصيانة',
        description:"الصيانه" ,
        url: '/home',
        // iconComponent: { name: 'cil-speedometer' },
      },
      {
        name: 'التحليل',
        description: "التحليل",

        url: '/home',
        // iconComponent: { name: 'cil-speedometer' },
      },
      {
        name: 'التوب',
        description: " التوب",

        url: '/top',
        // iconComponent: { name: 'cil-speedometer' },
      },
      {
        name: 'التقارير',
        description: "التقارير",

        url: '/reports',
        // iconComponent: { name: 'cil-speedometer' },
      },
      // {
      //   name: 'النواقص',
      //   url: '/home',
      //   // iconComponent: { name: 'cil-speedometer' },
      // },
      {
        name: 'محضر استقبال',

        description: "محضر الاستقبال",

        url: '/reception-report',
        // iconComponent: { name: 'cil-speedometer' },
      },
      {
        name: 'سندات القبض',
        description: "سندات القبض",
        url: '/client-payment',
        // iconComponent: { name: 'cil-speedometer' },
      },
      {
        name: 'توصيلات صحية',
        description:"التوصيلات الصحيه",

        url: '/sanitaryConnections',
        // iconComponent: { name: 'cil-speedometer' },
      },
      {
        name: 'فاتورة مشتريات',
        description: 'المستودع',
        url: '/warehouses'
      },
      {
        name: 'المورد',
        description: 'عرض الموردين',
        url: '/supplier'
      },
      {
        name: 'المادة',
        description: 'عرض المواد',
        url: '/material'
      },
      {
        name: 'المواد المستهلكة',
        description: 'المواد المستهلكة',
        url: '/consumables'
      },

    ];

}
getFilteredNavItems() {
  return new Promise<INavData[]>((resolve, reject) => {
    this._userService.GetPermissionsOfRole(1).subscribe({
      next: (res: any) => {
        this.pagesToShow = res.data;
        this.pagesToShow.unshift(this.navItems[1]);
        this.pagesToShow.unshift(this.navItems[0]);

        // Filter navItems based on descriptions in pagesToShow
        const filteredNavItems = this.pagesToShow.map(item => {
          return this.navItems.find(nav => nav.description === item.description);
        }).filter(Boolean) as INavData[]; // Filter out undefined/null items

        console.log("Filtered navItems:", filteredNavItems);
        resolve(filteredNavItems);
      },
      error: (err: any) => {
        console.error("Error fetching permissions:", err);
        reject(err);
      }
    });
  });
}

}
export default nav;
