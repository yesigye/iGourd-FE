/**
 * @description: 下载文件
 * @param {string} file 文件
 * @returns {void} 无返回值
 */
export const handleGlobalDownload = async (file: {
  attachment_url: string
  attachment_name?: string
}) => {
  try {
    const response = await fetch(file.attachment_url)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', file.attachment_name || 'download')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 释放 URL 对象
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading the file:', error)
  }
}
