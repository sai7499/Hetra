import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'langugaePipe',
    pure: false
})
export class LangugaePipe implements PipeTransform {
    transform(value: string) {
        console.log('value', value);
        // in this we need to subscripe json file and filter the value.
    }
}
