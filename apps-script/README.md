# Live reservation counts (Google Apps Script)

1. Open the Google Sheet that receives your form responses (the form's Responses tab > View in Sheets).
2. Choose **Extensions > Apps Script**.
3. Delete the sample code, paste in the contents of `Code.gs`, and click **Save**.
4. Click **Deploy > New deployment**. Click the gear next to "Select type" and choose **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** and approve the permissions (Google may show an "unverified app" warning: choose Advanced > Go to project).
6. Copy the **Web app URL** (it ends in `/exec`) and paste it into `countsUrl` in `config.js`.

If you ever edit the script, use **Deploy > Manage deployments > Edit > New version** so the same URL keeps working.
