/*
  Registry settings.

  Google Form + Sheet hookup (see apps-script/README.md for the instant-update script):
  - formResponseUrl / nameEntry / itemEntry: where each reservation is posted.
  - countsUrl:   Apps Script web app URL (optional, gives instant updates).
  - sheetCsvUrl: the form's responses sheet, published to the web as CSV (fallback).
*/
export const config = {
  babyName: "Little One",
  parents: "The Parents-to-Be",
  currency: "₦",

  formResponseUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdfvoGWH6ntnxQO-R_yw2qdbyrRwi8069XIdOhz-nyudqGYnw/formResponse",
  nameEntry: "entry.1256149239",
  itemEntry: "entry.741310361",
  countsUrl: "",
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSRNCcA8Ro7nzWox6Lh5Osa732ZUidxCaR19djvVP1nzcvxfUvBI_VS1aULYc9QZDg4E0F5YUD5CuIB/pub?output=csv",
  refreshSeconds: 30,
}
