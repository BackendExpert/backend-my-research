import { FileInterceptor } from '@nestjs/platform-express';
import { pdfUploadOptions } from '../middleware/pdf-upload.middleware';

export const PdfUploadInterceptor = () =>
    FileInterceptor('cv', pdfUploadOptions);