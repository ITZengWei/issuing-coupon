/** 将内容转换为文件 */
export function contentToFile(fileName: string, content: string) {
  /** 获取 a 元素 */
  const aTag = document.createElement('a')
  /** 将数据保存在 blob 对象中 */
  const blob = new Blob([content])
  /** 设置保存的文件名称 */
  aTag.download = fileName
  const url = URL.createObjectURL(blob)
  /** 将数据保存在 href 属性中 */
  aTag.href = URL.createObjectURL(blob)
  /** 模拟点击 a 元素，进行下载 */
  aTag.click()
  /** 删除内存中的 blob 对象的数据 */
  URL.revokeObjectURL(url)
}
