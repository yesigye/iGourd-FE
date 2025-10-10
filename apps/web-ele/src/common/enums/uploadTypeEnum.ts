export enum UploadTypeEnum {
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  CSV = 'text/csv',
  DOC = 'application/msword', // word
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  PDF = 'application/pdf',
  // 图片
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  GIF = 'image/gif',
  // 视频
  MP4 = 'video/mp4',
  MOV = 'video/mov',
  PPT = 'application/vnd.ms-powerpoint',
  ZIP = 'application/zip,application/x-zip-compressed',
  RAR = 'application/rar,application/x-compressed',
  XTAR = 'application/x-tar,application/x-compressed',
  XGZIP = 'application/x-gzip,application/x-compressed'
}

export const InvertUploadTypeMap = Object.keys(UploadTypeEnum).reduce((aur, cur) => {
  UploadTypeEnum[cur].split(',').forEach(key => {
    aur[key] = cur;
  });
  return aur;
}, {});
