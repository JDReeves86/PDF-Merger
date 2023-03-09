"use strict"

import fs = require('fs');
import util = require('util');
require('dotenv').config()
import PDFMerger = require('pdf-merger-js');

const pdfDir: String = process.env.PDF_HOME;
const readdir = util.promisify(fs.readdir);
let merger: PDFMerger = new PDFMerger()

const makePDFList: Function = async (directory: fs.PathLike) => {
  try {
    const fileArr: Object = await readdir(directory)
    mergePDFs(fileArr)
  } catch (err) {
    console.error(err);
  }
};

const mergePDFs: Function = async (input: Object) => {
    try {
        console.log(input)
    }
    catch(err) {console.error(err)}
}

makePDFList(pdfDir);

