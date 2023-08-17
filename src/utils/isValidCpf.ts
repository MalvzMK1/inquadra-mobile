export function isValidCPF(cpf: string): boolean{
    const cleanedCPF = cpf.replace(/[^\d]/g, '');
  

    if (cleanedCPF.length !== 11) {
      return false;
    }
  
    if (/^(\d)\1+$/.test(cleanedCPF)) {
      return false;
    }
  
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanedCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cleanedCPF.charAt(9))) {
      return false;
    }
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanedCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cleanedCPF.charAt(10))) {
      return false;
    }
  
    return true;
  };