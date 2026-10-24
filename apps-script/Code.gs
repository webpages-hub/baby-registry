/**
 * Baby registry: live reservation counts.
 *
 * Paste this into the Apps Script editor of the Google Sheet that receives your form responses
 * (Sheet > Extensions > Apps Script), then deploy it as a Web app (see apps-script/README.md).
 *
 * It only READS the sheet. It returns how many times each item has been reserved, e.g.
 *   { "counts": { "diapers (size 1)": 3, "stroller": 1 }, "updated": "2026-10-24T10:00:00.000Z" }
 * so the website can show "Reserved" the moment a response arrives, with no publishing delay.
 * Only item names and counts are returned. Guest names are never exposed.
 */
function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Form Responses 1') || ss.getSheets()[0];
  var values = sheet.getDataRange().getValues();
  var counts = {};

  if (values.length > 1) {
    var header = values[0];
    var col = -1;
    for (var i = 0; i < header.length; i++) {
      if (/item|gift/i.test(String(header[i]))) { col = i; break; }
    }
    if (col < 0) col = Math.min(2, header.length - 1);

    for (var r = 1; r < values.length; r++) {
      var item = String(values[r][col] || '').trim().toLowerCase();
      if (item) counts[item] = (counts[item] || 0) + 1;
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ counts: counts, updated: new Date().toISOString() }))
    .setMimeType(ContentService.MimeType.JSON);
}
