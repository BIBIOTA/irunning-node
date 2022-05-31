import moment from 'moment';

/* 月份中文陣列 */
const monthArr = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', ]

/* 回傳月份中文陣列 */
export function getMonthIndex (month) {
  let index;
  monthArr.forEach((MM, i) => {
    if (MM === month) {
      index = i;
    }
  });
  return index;
}

/* 轉換日期格式(YYYY/MM/DD TO YYYY-MM-DD) */
export function getDate(year, date) {
  const dateFormat = moment(new Date(`${year}/${date}`)).format('YYYY-MM-DD');
  return dateFormat;
}

/* YYYY-MM-DD TO YYYY/MM/DD */
export function formatDateDashToSlash(date) {
  return moment(date).format('YYYY/MM/DD');
}

/* Format chinese date to YYYY-MM-DD */
export function formatChineseDateToDate(year, string) {
  const date = moment(string.match(/^(0?[1-9]|1[0-2])[月](0?[1-9]|[12]\d|30|31)[日]/gi)[0], 'M月DD日', 'en', true).format('MM-DD');
  return year + '-' + date;
}
