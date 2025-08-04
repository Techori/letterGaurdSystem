import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { Document } from '@/types';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

class GoogleSheetsService {
  private sheets: any;

  constructor() {
    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !SHEET_ID) {
      console.warn('Google Sheets integration is not properly configured. Ensure GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID are set in your environment variables.');
      this.sheets = null;
      return;
    }

    const jwtClient = new google.auth.JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: jwtClient });
  }

  private async appendToSheet(values: any) {
    if (!this.sheets || !SHEET_ID) {
      console.warn('Google Sheets service is not initialized or SHEET_ID is missing.');
      return;
    }

    try {
      const request = {
        spreadsheetId: SHEET_ID,
        range: 'Sheet1',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: values
        },
        auth: this.sheets.auth,
      };

      const response = await this.sheets.spreadsheets.values.append(request);
      console.log('Google Sheets API Response:', response.data);
    } catch (error: any) {
      console.error('Error appending to Google Sheets:', error);
      throw error;
    }
  }

  async uploadDocument(document: Document): Promise<void> {
    try {
      const values = [
        [
          document._id || '',
          document.title,
          document.categoryId,
          document.letterTypeId,
          document.letterNumber,
          document.referenceNumber,
          new Date(document.issueDate).toLocaleDateString(),
          document.content,
          document.status,
          document.createdBy || '',
          new Date(document.createdAt || Date.now()).toLocaleDateString()
        ]
      ];

      await this.appendToSheet(values);
    } catch (error) {
      console.error('Error uploading document to Google Sheets:', error);
      throw error;
    }
  }

  async updateDocument(document: Document): Promise<void> {
    if (!this.sheets || !SHEET_ID) {
      console.warn('Google Sheets service is not initialized or SHEET_ID is missing.');
      return;
    }

    try {
      // First, find the row by matching the document ID
      const getValuesRequest = {
        spreadsheetId: SHEET_ID,
        range: 'Sheet1', // Specify the sheet name
        auth: this.sheets.auth,
      };

      const response = await this.sheets.spreadsheets.values.get(getValuesRequest);
      const rows = response.data.values;

      if (!rows) {
        console.log('No data found in the Google Sheet.');
        return;
      }

      let rowIndex = -1;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === document._id) { // Assuming document ID is in the first column
          rowIndex = i;
          break;
        }
      }

      if (rowIndex === -1) {
        console.log(`Document with ID ${document._id} not found in Google Sheet.`);
        return;
      }

      // Row index is 0-based, but Google Sheets API is 1-based, and the header row also counts
      const sheetRowIndex = rowIndex + 1;
      const range = `Sheet1!A${sheetRowIndex}:K${sheetRowIndex}`; // Adjust the range based on the number of columns

      const values = [
        [
          document._id || '',
          document.title,
          document.categoryId,
          document.letterTypeId,
          document.letterNumber,
          document.referenceNumber,
          new Date(document.issueDate).toLocaleDateString(),
          document.content,
          document.status,
          document.createdBy || '',
          new Date(document.createdAt || Date.now()).toLocaleDateString()
        ]
      ];

      const updateRequest = {
        spreadsheetId: SHEET_ID,
        range: range,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: values
        },
        auth: this.sheets.auth,
      };

      const updateResponse = await this.sheets.spreadsheets.values.update(updateRequest);
      console.log('Google Sheets API Update Response:', updateResponse.data);

    } catch (error) {
      console.error('Error updating document in Google Sheets:', error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
