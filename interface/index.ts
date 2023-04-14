import { File } from "buffer";
import { Request } from "express";

export interface Model3DRequest{
    name: string,
    description?: string,
}
interface IFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  }

export interface RequestWithFile extends Request{
    file?: IFile
}