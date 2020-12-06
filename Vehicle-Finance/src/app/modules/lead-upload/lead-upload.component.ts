import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as XLSX from 'xlsx';

import { LeadUploadService } from '@services/lead-upload.service';
import { ToastrService } from 'ngx-toastr';
import value from '*.json';

@Component({
  templateUrl: './lead-upload.component.html',
  styleUrls: ['./lead-upload.component.css'],
})
export class LeadUploadComponent implements OnInit {
  userId: any;
  showUploadModal: boolean;
  fileUrl: any;
  fileName: string;
  fileSize: string;
  showError: string;
  csvData: any;
  @ViewChild('fileInput', { static: false })
  fileInput: ElementRef;

  leadUploadDetails: any;

  constructor(
    private leadUploadService: LeadUploadService,
    private toasterService: ToastrService
  ) {}

  ngOnInit() {
      console.log('lead upload');
      this.userId = localStorage.getItem('userId');
  }

  onClose() {
    this.showUploadModal = false;
  }

  openUploadModal() {
    this.showUploadModal = true;
  }

  onModalClose() {
    this.leadUploadDetails = null;
  }

  saveValidRecords() {

    const assetLoanLead = this.leadUploadDetails.filter((value: any) => {
        return value.status === 'true';
    });

    console.log('assetLoanLead', assetLoanLead);

    if (!assetLoanLead || assetLoanLead.length === 0) {
        return this.toasterService.error('All are invalid records', '')
    }

    this.leadUploadService
        .saveValidRecords({
            assetLoanLead,
            userId: this.userId
        })
        .subscribe((res:any) => {
            console.log('inserted value', res);
            const processVariables = res.ProcessVariables;
            const error = processVariables.error;
            if (error && error.code !== '0') {
                return this.toasterService.error(error.message);
            }
            this.showUploadModal = false;
            this.leadUploadDetails = null;
            this.removeFile();
            this.toasterService.success('Saved Successfully');
        });

  }

  uploadFile() {
    if (this.showError) {
      this.toasterService.error('Please select valid document', '');
    }

    console.log('this.csvData', this.csvData);
    this.leadUploadService
      .validateLeadDetails({
        allText: this.csvData,
        userId: this.userId,
      })
      .subscribe((value: any) => {
        console.log('validateLeadDetails', value);
        const processVariables = value.ProcessVariables;
        const error = processVariables.error;
        if (error && error.code !== '0') {
            return this.toasterService.error(error.message);
        }
        this.leadUploadDetails = processVariables.assetLoanLead;
      });
  }

  removeFile() {

    this.fileUrl = null;
    this.fileName = null;
    this.fileSize = null;
    this.showError = null;
    this.fileInput.nativeElement.value = '';

  }

  onFileSelect(event) {
    this.csvData = null;
    const files: File = event.target.files[0];
    let fileType = '';
    this.fileUrl = files;
    const target: DataTransfer = event.target;
    if (target.files.length !== 1) {
      return this.toasterService.error('Cannot use multiple files', '');
    }
    if (!files.type) {
      const type = files.name.split('.')[1];
      fileType = this.getFileType(type);
    } else {
      fileType = this.getFileType(files.type);
    }
    this.fileName = files.name;
    this.fileSize = this.bytesToSize(files.size);
    console.log('fileType', fileType, 'event', event);
    if (!fileType) {
       return  this.showError = `Only files with following extensions are allowed: xlsx,csv`;
    }
    if (!fileType.includes('xls') && !fileType.includes('csv')) {
      this.showError = `Only files with following extensions are allowed: xlsx,csv`;
      return;
    }
    if (files.size > 2097152) {
      this.showError = `File is too large. Allowed maximum size is 2 MB`;
      return;
    }
    this.showError = null;

    const fileToRead = files;
    const fileReader = new FileReader();
    if (fileType.includes('xls')) {
      this.getDataFromXlsFile(target);
      //   fileReader.onload =  (e: any) => {
      //     console.log('xls', e.target.result);
      // };
      // fileReader.readAsBinaryString(files);
    } else {
      fileReader.onload = (fileLoadedEvent: any) => {
        const textFromFileLoaded = fileLoadedEvent.target.result;
        this.csvData = textFromFileLoaded;
      };
      fileReader.readAsText(fileToRead);
    }
  }

  getDataFromXlsFile(target) {
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {
        type: 'binary',
        cellDates: true,
      });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log('data', data);
      if (data && data.length !== 0) {
        const size = data.length;
        const header: any = data[0];
        let i = -1;
        const dateHeaders = [];
        for (const element of header) {
          i++;
          if (element.includes('date')) {
            dateHeaders.push(i);
          }
        }
        data = this.getDateFormattedXlsData(data, dateHeaders);
        const xlsData = data.map((value: any, index) => {
          let val = value.join(',');
          if (size - 1 !== index) {
            val = val === '' ? '' : val + '\r\n';
          }
          return val;
        });
        let finalData = '';
        xlsData.forEach((value) => {
          finalData += value;
        });
        this.csvData = finalData;
        console.log('this.csvData', this.csvData);
      }
    };
    reader.readAsBinaryString(target.files[0]);
    // readXlsxFile(file).then(rows => {
    //   const size = rows.length;
    //   const data = rows.map((value, index) => {
    //     let val = value.join(',');
    //     if (size - 1 !== index) {
    //       val = val + '\r\n';
    //     }
    //     return val;
    //   });
    //   let finalData = '';
    //   data.forEach((value) => {
    //     finalData += value;
    //   });
    //   this.csvData = finalData;
    // });
  }

  getDateFormattedXlsData(data, dateIndex: any[]) {
    let index = -1;
    for (const element of data) {
        index++;
        if (index !== 0) {
           dateIndex.forEach((value) => {
            const dataValue = element[value];
            const parse = Date.parse(dataValue);
            if ( !isNaN(parse) && parse >= 0) {
              if (dataValue.includes('-')) {
                 let dateValue = dataValue.split('-');
                 if (dateValue.length === 3) {
                   dateValue = dateValue.join('/');
                   element[value] = dateValue;
                   data[index] = element;
                 }
              } else if (dataValue.includes('/')) {
                let dateValue = dataValue.split('/');
                if (dateValue.length === 3) {
                  dateValue = dateValue.join('/');
                  element[value] = dataValue;
                  data[index] = element;
                }
             } else {
              const d = new Date(dataValue);
              let month: any = d.getMonth() + 1;
              const year = d.getFullYear();
              let day: any = d.getDate();
              day = day <= 9 ? `0${day}` : day;
              month = month <= 9 ? `0${month}` : month;
              element[value] = `${day}/${month}/${year}`;
              data[index] = element;
             } 
            }
           });
        }
    }
    return data;
  }

  onFileLoad(fileLoadedEvent: any) {
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvData = textFromFileLoaded;
  }

  getFileType(type: string) {
    const types = {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'xlsx',
      'image/tiff': 'tiff',
      'application/pdf': 'pdf',
      'image/png': 'png',
      'image/jpeg': 'jpeg',
      'application/msword': 'docx',
      'text/csv': 'csv',
      csv: 'csv',
    };
    return types[type] || type;
  }

  private bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return 'n/a';
    }
    const i = Number(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i === 0) {
      return bytes + ' ' + sizes[i];
    }
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  }
}