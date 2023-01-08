import { checkResult } from "../app/types";

class OrderModel {

  checkField(fieldName: string, fieldValue: string): checkResult {
    
    const validation: [string, (value: string) => boolean, string][] = [
      ['order-name', (value: string): boolean => value.split(' ').filter(_ => _.length >=3).length >= 2, 'Field must contain at least 2 words with more than 3 letters'],
      ['order-phone', (value: string): boolean => this.checkByRegExp(value, '^\\+\\d{9,12}'), 'Phone must start with + and contain from 9 to 12 digits'],
      ['order-address', (value: string): boolean => value.split(' ').filter(_ => _.length >=5).length >= 3, 'Adress must contain at least 3 words with more than 5 letters'],
      ['order-email', (value: string): boolean => this.checkByRegExp(value, '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'), 'Not valid email'],
      ['order-card-number', (value: string): boolean => (value !== '' && this.isCreditCardNumberValid(value)), 'Invalid card number'],
      ['order-card-until', (value: string): boolean => this.isCreditCardUntilValid(value), 'Invalid date'],
      ['order-card-cvv', (value: string): boolean => this.checkByRegExp(value, '^\\d\\d\\d$'), 'CVV code must contain 3 digits'],
    ]
    for (const item of validation) {
      if (item[0] === fieldName) {
        return (item[1](fieldValue)) ? [true] : [false, item[2]];
      }
    }
    return [true];
  }

  checkByRegExp(value: string, pattern: string): boolean {
    return (value.match(pattern) !== null) ? true : false;
  }

  isCreditCardNumberValid(ccn: string): boolean {
    let sum = 0;
    ccn = ccn.replace(/ /g, '');
    (`${ccn}`).split('').reverse().map((num, indx) => {
      let numm: number = parseInt(num);
      if ((indx + 1) % 2 === 0) {
        numm *= 2;
        if (numm > 9) {
          numm -= 9;
        }
      }
      sum += +numm;
      return num;
    });
    return (sum % 10 === 0);
  }

  isCreditCardUntilValid(validUntil: string): boolean {
    const validArr: string[] = validUntil.split('/');
    if (validArr.length === 2) {
      const month: number = parseInt(validArr[0]);
      const year: number = parseInt(validArr[1]);
      if (month && year && month > 0 && month <= 12 && year >= 22) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  formatField(fieldName: string, fieldValue: string): string {
    
    const validation: [string, (value: string) => string][] = [
      ['order-card-number', (value: string): string => value.replace(/[^0-9]/g, '').replace(/(\d\d\d\d)/g, '$1 ').replace(/ $/, '')],
      ['order-card-until', (value: string): string => value.replace(/[^0-9]/g, '').replace(/^(\d\d)(\d{0,2})$/g, '$1/$2').replace(/\/$/,'')],
      ['order-card-cvv', (value: string): string => value.replace(/[^0-9]/g, '')],
    ]
    for (const item of validation) {
      if (item[0] === fieldName) {
        return (item[1](fieldValue));
      }
    }
    return fieldValue;
  }


}

export default OrderModel;