/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Placeholder for PDF Export service
 * Will handle rendering resumes to PDF
 */
export class PDFService {
  static async generatePDF(_resumeData: unknown, _templateId: string) {
    // throw new Error('Not implemented');
    return new Blob([], { type: 'application/pdf' });
  }

  static async downloadPDF(_resumeData: unknown, _templateId: string, filename: string) {
    // throw new Error('Not implemented');
    console.log(`Downloading ${filename}...`);
  }
}
