const format = number => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  return formatter.format(number)
}

// To parse X,XXX.XX to number
const fromStyledStringToNumber = string => {
  if (string) return parseFloat(string.toString().replaceAll(',', ''))
  return 0
}

// To parse XXXXXX.XX number to XXX,XXX.XX
const fromNumberToStyledString = number => {
  if (number)
    return number.toString().split('.').length > 1
      ? `${number
          .toString()
          .split('.')[0]
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${number.toString().split('.')[1]}`
      : number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return '0'
}

export default {
  format,
  fromStyledStringToNumber,
  fromNumberToStyledString,
}
