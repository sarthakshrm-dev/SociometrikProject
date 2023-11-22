import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const ExportCSV = ({ csvData, fileName }) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = (csvData, fileName) => {
    let array = [];
    csvData.forEach((element) => {
      let obj = new Object();
      obj['Location'] = element.x;
      obj['Market Potention Score'] = element.y;
      array.push(obj);
    });
    const ws = XLSX.utils.json_to_sheet(array);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button onClick={() => exportToCSV(csvData, fileName)}>
      Export <span className="icon-download"></span>
    </button>
  );
};

export default ExportCSV;
