export const SIMPLE_TABLE_ITEMS_PER_PAGE = 8

export const immediateMessage = `
Ở hình thức này, sau khi phiên đấu giá kết thúc, 
người mua và người bán sẽ liên hệ với nhau qua hệ thống chat và giải quyết việc mua bạn trực tiếp với nhau, 
để có được thông tin người mua, người bán phải thanh toán cho hệ thống
`

export const intermediateMessage = `
Ở hình thức này, sau khi phiên đấu giá kết thúc, 
người mua phải trả tiền trước cho hệ thống, sau khi hàng tới nơi người mua mà không có khiếu nại, đổi trả, 
hệ thống sẽ chuyển số tiền người mua đã trả cho người bán
`

export const durationData = [
    {
      label: '1 tiếng',
      value: 1,
    },
    {
      label: '3 tiếng',
      value: 3,
    },
    {
      label: '5 tiếng',
      value: 5,
    },
    {
      label: '10 tiếng',
      value: 10,
    },
    {
      label: '1 ngày',
      value: 24,
    },
    {
      label: '2 ngày',
      value: 48,
    },
    {
      label: '3 ngày',
      value: 72,
    },
    {
      label: '7 ngày',
      value: 24 * 7,
    },
    {
      label: 'Khác',
      value: null,
    },
]

export const selectedDefaultDuration = {
    label: '3 tiếng',
    value: 3,
}

export const DUMP_IMG_FILE_DATA = 'dump-data'