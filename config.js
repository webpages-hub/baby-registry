/*
  Registry settings. Fill in the Google Form parts when you have the form.

  HOW TO FIND THE FORM VALUES
  1. Make a Google Form with two "Short answer" questions: "Full name" and "Item reserved".
  2. Open the form, click the three dots (top right) > "Get pre-filled link".
     Type "a" in each question, click "Get link", paste it somewhere.
     The link looks like:
       https://docs.google.com/forms/d/e/1FAIpQLSd.../viewform?usp=pp_url&entry.111111=a&entry.222222=a
     - formResponseUrl = the part up to the form id, but ending in /formResponse
         https://docs.google.com/forms/d/e/1FAIpQLSd.../formResponse
     - nameEntry / itemEntry = the entry.NNNN ids (name question first, item question second).
  3. To make "Reserved" show for EVERYONE (not just on the visitor's own phone):
     In the form's Responses tab, click "Link to Sheets". In the sheet:
     File > Share > Publish to web > pick the responses sheet and "Comma-separated values (.csv)" > Publish.
     Paste that link into sheetCsvUrl. (It only exposes the responses, so you may prefer to keep the form
     questions to just name + item, which is all the registry sends.)
*/
window.REGISTRY_CONFIG = {
  babyName: "Little One",
  parents: "The Parents-to-Be",
  currency: "₦",

  formResponseUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdfvoGWH6ntnxQO-R_yw2qdbyrRwi8069XIdOhz-nyudqGYnw/formResponse",
  nameEntry: "entry.1256149239",
  itemEntry: "entry.741310361",
  countsUrl: "",         // Apps Script web app URL for instant updates (see apps-script/Code.gs)
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSRNCcA8Ro7nzWox6Lh5Osa732ZUidxCaR19djvVP1nzcvxfUvBI_VS1aULYc9QZDg4E0F5YUD5CuIB/pub?output=csv",
  refreshSeconds: 30
};
