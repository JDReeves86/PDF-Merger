"use strict";

import fs = require("fs");
import util = require("util");
require("dotenv").config();
import PDFMerger = require("pdf-merger-js");

const pdfDir: String = process.env.PDF_HOME;
const readdir = util.promisify(fs.readdir);
let merger: PDFMerger = new PDFMerger();

const makePDFList: Function = async (directory: fs.PathLike) => {
  try {
    const fileArr: Object = await readdir(directory);
    mergePDFs(fileArr);
  } catch (err) {
    console.error(err);
  }
};

const mergePDFs: Function = async (input: [Object]) => {
  try {
    input.forEach(async (element: string) => {
      await merger.add(element);
    });
    await merger.save("merged.pdf");
    // Export the merged PDF as a nodejs Buffer
    // const mergedPdfBuffer = await merger.saveAsBuffer();
    // fs.writeSync('merged.pdf', mergedPdfBuffer);
  } catch (err) {
    console.error(err);
  }
};

makePDFList(pdfDir);
