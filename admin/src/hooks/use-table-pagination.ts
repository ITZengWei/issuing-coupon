import { Dispatch, SetStateAction, useState } from 'react'
import { TablePaginationConfig } from 'antd/lib/table'

interface IUseTablePagination {
  (config?: TablePaginationConfig): [
    TablePaginationConfig,
    Dispatch<SetStateAction<TablePaginationConfig>>,
    (len: number) => void,
    any,
  ]
}

/** 表格分页 */
const useTablePagination: IUseTablePagination = config => {
  /** 分页设置 */
  const [pagination, setPagination] = useState<TablePaginationConfig>(() => {
    const defaultConfig: TablePaginationConfig = {
      current: 1,
      pageSize: 6,
      total: 18,
      onChange(page) {
        setPagination(pagination => ({
          ...pagination,
          current: page,
        }))
      },
      position: ['bottomRight'],
      hideOnSinglePage: true,
      showQuickJumper: false,
      showSizeChanger: false,
      size: 'default',
    }
    return Object.assign({}, defaultConfig, config)
  })
  /** 删除之后调整分页 */
  function afterRemoveChangePagination(tableDataLen: number) {
    const { current, total, pageSize } = pagination
    console.log(current, total, pageSize)
    if (tableDataLen === 0) {
      setPagination(pageInfo => {
        let { current } = pageInfo
        if (!current) return pageInfo
        current -= 1
        if (current === 0) {
          current = 1
        }
        return { ...pageInfo, current }
      })
    }
  }

  /** 添加之后调整分页 */
  function afterCreateChangePagination() {}

  return [
    pagination,
    setPagination,
    afterRemoveChangePagination,
    afterCreateChangePagination,
  ]
}

export default useTablePagination
