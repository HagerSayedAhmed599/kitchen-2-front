import { Component } from '@angular/core';

@Component({
  selector: 'app-reports-home',
  templateUrl: './reports-home.component.html',
  styleUrls: ['./reports-home.component.scss']
})
export class ReportsHomeComponent {
  icons = [
    { icon: '4', label: 'العقود',link:'contractReport' },
    { icon: '2', label: 'المتابعات',link:'FollowReport' },
    { icon: '15', label: 'حالة المطبخ',link:'KitchenStatusReport' },
    { icon: 'assets/icons/maintenance-icon.png', label: 'الصيانة',link:'' },
    { icon: 'assets/icons/notes-icon.png', label: 'الملاحظات',link:'' },
    { icon: 'assets/icons/filter-icon.png', label: 'النواقص',link:'' },
    { icon: 'assets/icons/account-icon.png', label: 'كشف حساب',link:'' },
    { icon: 'assets/icons/receipt-icon.png', label: 'سندات القبض',link:'' },
    { icon: 'assets/icons/tax-icon.png', label: 'ضريبة المبيعات' ,link:''},
    { icon: '16', label: 'تاريخ التركيب',link:'TarkeebReminder' }
  ];

  constructor() {

  }
}
