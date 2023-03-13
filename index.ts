"use strict";

import fs = require("fs");
import util = require("util");
require("dotenv").config();
import inquirer from "inquirer";
import PDFMerger = require("pdf-merger-js");

let pdfDir: String = process.env.PDF_HOME;
const readdir = util.promisify(fs.readdir);
let merger: PDFMerger = new PDFMerger();

const directoryPrompts: [Object] = [
  {
    type: "input",
    name: "sourceDir",
    message:
      "What is the source directory of the documents you wish to merge? (Copy entire path of the folder housing the pdf docs.)",
  },
];

const directoryQuestions: Function = () => {
  inquirer
    .prompt(directoryPrompts)
    .then((response: { sourceDir: string }) => {
      let fileList: Object[] = makePDFList(response.sourceDir);
      return fileList;
    })
    .then((data) => {
      return inquirer.prompt({
        type: "list",
        name: "fileSelect",
        message: "Which file do you wish to add?",
        choices: data,
      });
    })
    .then((data) => {
      console.log(data);
    });
};

const init: Function = () => {
  return directoryQuestions();
};

const makePDFList: Function = async (directory: fs.PathLike) => {
  try {
    const fileArr: Object = await readdir(directory);
    return fileArr;
  } catch (err) {
    console.error(err);
  }
};

const mergePDFs: Function = async (input: [Object]) => {
  try {
    for (const file of input) {
      await merger.add(`${pdfDir}/${file}`);
    }
    await merger.save(`${pdfDir}/merged.pdf`);
  } catch (err) {
    console.error(err);
  }
};

init()
