import { Pipe, Injectable, PipeTransform } from '@angular/core';

@Pipe({
  name: 'docsUpload',
})
export class DocsUploadPipe implements PipeTransform {
  transform(value, params) {
    return value[params].issueDate;
  }
}
