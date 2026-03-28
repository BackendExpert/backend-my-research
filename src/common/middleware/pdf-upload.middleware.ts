import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

const allowedFolders = [
    'preprints',
    'conference_papers',
    'articles',
    'technical_reports',
    'research',
    'books',
    'posters',
    'presentations',
    'data',
    'chapters',
    'code',
    'cover_pages',
    'experimental_findings',
    'methods',
    'negative_results',
    'patents',
    'raw_data',
    'research_proposals',
    'thesis',
];

export const pdfUploadOptions = {

    storage: diskStorage({
        destination: (req, file, callback) => {
            const folder = req.body.folder;

            if (!allowedFolders.includes(folder)) {
                return callback(
                    new BadRequestException('Invalid folder name'),
                    './uploads' 
                );
            }

            callback(null, `./uploads/${folder}`);
        },

        filename: (req, file, callback) => {
            const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);

            const fileExt = extname(file.originalname);

            callback(null, `${uniqueSuffix}${fileExt}`);
        },
    }),

    fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
            return callback(
                new BadRequestException('Only PDF files are allowed'),
                false,
            );
        }

        callback(null, true);
    },

    limits: {
        fileSize: 25 * 1024 * 1024, 
    },
};