const express = require('express');
const puppeteer = require('puppeteer');

/**
 * @desc    Generates a PDF report from an HTML string
 * @param   {string} reportHtml - The HTML content to convert to PDF.
 * @returns {Buffer} The PDF document as a Buffer.
 */
const generatePdfReport = async (reportHtml) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set the HTML content of the page
  await page.setContent(reportHtml, {
    waitUntil: 'networkidle0',
  });

  // Generate the PDF from the page content
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
};

// You can add other report-related functions here in the future
module.exports = {
  generatePdfReport,
};
