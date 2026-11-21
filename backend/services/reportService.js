const fs = require('fs');

async function extractReport(file) {
  if (!file) return { text: '', extractedParameters: [], incomplete: true, limitations: ['No report uploaded'] };

  let text = '';
  try {
    if (file.mimetype === 'application/pdf') {
      const { PDFParse } = require('pdf-parse');
      const parser = new PDFParse({ data: fs.readFileSync(file.path) });
      const result = await parser.getText();
      text = result.text || '';
      await parser.destroy();
    } else {
      const Tesseract = require('tesseract.js');
      const result = await Tesseract.recognize(file.path, 'eng');
      text = result.data.text || '';
    }
  } catch (error) {
    return { text: '', extractedParameters: [], incomplete: true, limitations: [`Report extraction failed: ${error.message}`] };
  }

  const parameters = [];
  const lines = text.split(/\r?\n/).filter(Boolean);
  for (const line of lines) {
    const match = line.match(/([A-Za-z][A-Za-z ()%/_-]{1,35})\s+([0-9]+(?:\.[0-9]+)?)[ ]*([A-Za-zµμ/%^0-9./^-]*)/);
    if (match) parameters.push({ parameter: match[1].trim(), patientValue: match[2], unit: match[3], referenceRange: '', uncertain: true });
  }

  return {
    text,
    extractedParameters: parameters,
    incomplete: parameters.length === 0,
    limitations: parameters.length === 0 ? ['The report text could not be mapped to reliable laboratory parameters'] : ['Reference ranges and extracted values should be verified against the original report']
  };
}

module.exports = { extractReport };
