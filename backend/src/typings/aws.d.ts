import { Buffer } from 'buffer';

export interface IAWSFile {
    originalName?: string;
    mimetype?: any;
    buffer?: Buffer;
}
