import * as json2csv from 'json2csv/lib/json2csv';
import * as dateFormat from 'dateformat/lib/dateformat';
import {AdminApplication} from '@sonkal/application-type';
import {Return} from "typescript-rest";

const fields = ['trans.submittedOn', 'data.firstName', 'data.lastName', 'data.email', 'data.personalId', 'data.phone',
    'data.address.street', 'data.address.city', 'data.address.postCode', 'data._id'];

const fieldNames = ['Submitted', 'First Name', 'Last Name', 'E-Mail', 'Personal ID', 'Phone',
    'Street', 'City', 'Postal Code', 'ID'];

export function CsvConvert(data: AdminApplication[]) {
    // wrap data to transform it because original objects are immutable
    let tData: {data: AdminApplication, trans: any}[] = [];
    data.forEach((val: AdminApplication) => {
        let tDate = dateFormat(val.meta.submittedOn, "yyyy-mm-dd h:MM:ss");
        tData.push({
            data: val,
            trans: {submittedOn: tDate}
        });
    });
    // convert to CSV
    let csv = json2csv({
        data: tData,
        fields: fields,
        fieldNames: fieldNames,
        doubleQuotes: ''
    });
    return new Buffer(csv);
}

function CsvFileName(): string {
    let d = dateFormat(new Date(), "-yyyy-mm-dd-HH-MM");
    return `data${d}.csv`;
}

export function CsvExportHandler(resolve: (value: any) => void, csv: boolean) {
    return function (values: {data: AdminApplication[]}) {
        if (!csv)
            return resolve(values);

        let buffer = CsvConvert(values.data);
        resolve(new Return.DownloadBinaryData(buffer, "application/json", CsvFileName()));
    };
}

