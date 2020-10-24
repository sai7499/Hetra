import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ObjectComparisonService {
    compare(obj1, obj2) {
        for (const key in obj1) {
          if (obj1.hasOwnProperty(key)) {
            obj1[key] = obj1[key] === null ? '' : obj1[key];
            obj2[key] = obj2[key] === null ? '' : obj2[key];
            if (typeof obj1[key] === 'object') {
              const obj1Length = Object.keys(obj1[key]).length;
              const obj2Length = Object.keys(obj2[key]).length;
              if (obj1Length !== obj2Length) {
                console.log('length', key);
                return false;
              }
              const value = this.compare(obj1[key], obj2[key]);
              if (!value) {
                  return false;
              }
            } else {
                try {
                    if (obj1[key] !== obj2[key]) {
                      console.log('key', key);
                      return false;
                    }
                  } catch (e) {
                    console.log('error', key);
                    return false;
                  }
            }
          }
      }
        return true;
    }

    isThereAnyUnfilledObj(obj) {
      let result = false;
      let index = -1;
      for ( const val of obj) {
        index++;
        const keys = Object.keys(val);
        const value = keys.every((key) => {
          return !!val[key];
        });
        if (!value) {
          const inValue = keys.every((key) => {
            console.log(val[key], !val[key]);
            return !val[key];
          });
          if (inValue) {
            continue;
          }
          result = {
            ...val,
            index
          };
          break;
        }
      }
      return result;
    }
}
