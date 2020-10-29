import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], searchText?: string, fieldName?: string): any[] {

    if (!items) { return []; }

    if (!searchText) { return items; }

    // searchText = searchText.toLocaleLowerCase();

    return items.filter((val) => {
      // console.log(val, 'searchText', searchText, 'fieldName', fieldName)

      if (val && val[fieldName]) {
        console.log(val.leadId.toString().includes(searchText))
        // return (val.leadId.toString().toLocaleLowerCase().includes(searchText)) || (val.name.toString().toLocaleLowerCase().includes(searchText)) || (val.product.toString().toLocaleLowerCase().includes(searchText))
        return val[fieldName].toString().toLocaleLowerCase().includes(searchText)
      }
      return false;
    });

  }

}
