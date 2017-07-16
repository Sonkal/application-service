import * as json2csv from 'json2csv/lib/json2csv';
import {Application} from '@sonkal/application-type';

const fields = ['meta.submittedOn', 'firstName', 'lastName', 'email', 'personalId', 'phone',
    'address.street', 'address.city', 'address.postCode', '_id'];

const fieldNames = ['Submitted', 'First Name', 'Last Name', 'E-Mail', 'Personal ID', 'Phone',
    'Street', 'City', 'Postal Code', 'ID'];

export function CsvExport(data: Application[]) {
    let csv = json2csv({
        data: data,
        fields: fields,
        fieldNames: fieldNames,
        doubleQuotes:''
    });
    return new Buffer(csv);
}

