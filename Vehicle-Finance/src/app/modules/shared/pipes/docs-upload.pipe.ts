import { Pipe, Injectable, PipeTransform } from '@angular/core';

@Pipe({
  name: 'docsUpload',
})
export class DocsUploadPipe implements PipeTransform {
  transform(value, params) {
    console.log('pipe value', value, params);
    return value[params].issueDate;
  }
}
