/**
 * @description: 下载文件
 * @param {string} file 文件
 * @returns {void} 无返回值
 */
export const handleGlobalDownload = async (file: {
  attachment_name?: string;
  attachment_url: string;
}) => {
  try {
    const response = await fetch(file.attachment_url);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.attachment_name || 'download');
    document.body.append(link);
    link.click();
    link.remove();

    // 释放 URL 对象
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading the file:', error);
  }
};
export const blobDownload = (blob: Blob, fileName: string) => {
  // 新的URL
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.style.display = 'none';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.href = url;
  link.download = fileName;

  // 延迟下载
  setTimeout(() => {
    document.body.append(link);
    link.click();
    link.remove();
  }, 100);
};
export  interface EnumItem {
  value: string;
  label: string;
}
export const getEnumLabel = (list: EnumItem[], key: string) => {
  const obj = list.find((item: EnumItem) => item.value === key);
  return obj?.label;
};
