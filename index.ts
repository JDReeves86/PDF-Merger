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

const directoryQuestions: Function = async () => {
  try {
    const response: { sourceDir: string } = await inquirer.prompt(
      directoryPrompts
    );
    const sorted: Object[] = await makePDFList(response.sourceDir);
    return fileQuestions(sorted);
  } catch (error) {
    console.log(error);
  }
};

const fileQuestions: Function = async (input: Object[]) => {
  const filePrompts: Object[] = [
    {
      type: "list",
      name: "fileSelect",
      message: "Which file do you wish to add?",
      choices: input,
    },
    {
      type: "list",
      name: "pages",
      message:
        "Do you want to merge the whole document, a specific page, or a range of pages?",
      choices: ["Whole document", "Single page", "Page range"],
    },
    {
      type: "input",
      name: "singlePage",
      message: "Which page do you wish to add?",
      when(response: { pages: string }) {
        return response.pages === "Single page";
      },
    },
    {
      type: "input",
      name: "startPageRange",
      message: "Which page do you wish to start the add?",
      when(response: { pages: string }) {
        return response.pages === "Page range";
      },
    },
    {
      type: "input",
      name: "endPageRange",
      message: "Which page do you wish to stop the add?",
      when(response: { pages: string }) {
        return response.pages === "Page range";
      },
    },
    {
      type: "list",
      name: "addMore",
      message: "Do you want to add more documents to the merge?",
      choices: ["Yes", "No"],
    },
    {
      type: "input",
      name: "output",
      message: "What do you want the name of the merged file to be?",
      when(response: { addMore: string }) {
        return response.addMore === "No";
      },
    },
  ];
  try {
    const response = await inquirer.prompt(filePrompts);
    switch (response.pages) {
      case "Single page":
        await merger.add(
          `${pdfDir}/${response.fileSelect}`,
          response.singlePage
        );
        break;
      case "Page range":
        await merger.add(
          `${pdfDir}/${response.fileSelect}`,
          `${response.startPageRange} to ${response.endPageRange}`
        );
        break;
      default:
        await merger.add(`${pdfDir}/${response.fileSelect}`);
        break;
    }
    if (response.addMore == "No") {
      await merger.save(`${pdfDir}/${response.output}.pdf`);
    } else {
      return fileQuestions(input);
    }
  } catch (error) {
    console.log(error);
  }
};

const makePDFList: Function = async (directory: fs.PathLike) => {
  try {
    const fileArr: Object = await readdir(directory);
    return fileArr;
  } catch (err) {
    console.error(err);
  }
};

directoryQuestions();
