import {format, parseISO} from 'date-fns';

export function formatDateTime(dateTimeString: string): string {
    try {
        const parsedDateTime = parseISO(dateTimeString);
        const formattedDate = format(parsedDateTime, 'dd/MM/yyyy');
        const formattedTime = format(parsedDateTime, 'HH:mm');
        return `${formattedDate} as ${formattedTime}`;
      } catch (error) {
        console.error('Erro ao converter a data:', error);
        return 'Data inválida';
      }
  }

  export function formatDate(dateTimeString: string): string {
    try {
        const parsedDateTime = parseISO(dateTimeString);
        const formattedDate = format(parsedDateTime, 'dd/MM/yyyy');
        return `${formattedDate}`;
      } catch (error) {
        console.error('Erro ao converter a data:', error);
        return 'Data inválida';
      }
  }

  export function convertToAmericanDate(dateString: string) {
    const [month, year] = dateString.split('/');
    const currentYear = new Date().getFullYear();
    const currentCentury = Math.floor(currentYear / 100);
  
    const yearInFull = currentCentury * 100 + parseInt(year, 10);

    return `${yearInFull}-${month}-01`;
  }