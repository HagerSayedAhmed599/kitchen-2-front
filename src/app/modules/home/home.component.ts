import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  listOfCategories:any[]=[
    {
      icon:'1',
      name:'عروض الاسعار',
      link:'quotations'

    },
    {
      icon:'4',
      name:'العقد',
      link:'contract'

    },
    {
      icon:'5',
      name:'طلبات الانتاج',
      link:'production-requests'

    },
    {
      icon:'2',
      name:'المتابعات',
      link:'follows'

    },
    {
      icon:'3',
      name:'الملاحظات',
      link:''

    },


    {
      icon:'6',
      name:'الصيانة',
      link:''

    },
    {
      icon:'7',
      name:'التحليل',
      link:''

    },
    {
      icon:'8',
      name:'محضر استقبال',
      link:'reception-report'

    },
    {
      icon:'9',
      name:'التوب',
      link:'top'

    },
    {
      icon:'10',
      name:'سندات القبض',
      link:'client-payment'

    },
    {
      icon:'11',
      name:'التقارير',
      link:'follows'

    },
    {
      icon:'12',
      name:'توصيلات صحية',
      link:'follows'

    },
    {
      icon:'13',
      name:'النواقص',
      link:'follows'

    },
  ]
}
