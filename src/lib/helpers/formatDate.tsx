
export const formatDate = (inputDate: any): string => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = new Date(inputDate).toLocaleDateString('en-US', options);
    return formattedDate;
};

export const isDate1BeforeOrEqual=(dateString1:any, dateString2:any)=> {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
  
    return  date2 <= date1;
  }

export const timeFormat=(inputTime:any)=>{
    const fixedDate = new Date(`2000-01-01T${inputTime}`);
    const hours = fixedDate.getHours();
    const minutes = fixedDate.getMinutes();
    const formattedHours = hours % 12 || 12;
    const period = hours < 12 ? 'AM' : 'PM';
    const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    return formattedTime;
}


