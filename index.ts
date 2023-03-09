import fs = require('fs');
import util = require('util');
require('dotenv').config()
// import * as PDFMerger from 'pdf-merger-js';

const pdfDir = process.env.PDF_HOME;
const readdir = util.promisify(fs.readdir);

const makePDFList = async (directory: fs.PathLike) => {
  let fileArr: Object;
  try {
    fileArr = await readdir(directory)
  } catch (err) {
    console.error(err);
  }
  return fileArr;
};

const check = async () => {
    try {
        
    }
    catch(err) {console.error(err)}
}

// const makePDFList = (directory) => {
//     fs.readdirSync(directory).forEach(file => {
//         fileArr.push(file)
//     })
// }
makePDFList(pdfDir);
// console.log(fileArr);
