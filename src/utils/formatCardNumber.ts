export function formatCardNumber(cardNumber: string) {
  const cleanedCardNumber = cardNumber.replace(/[\s-]/g, "");

  if (!/^\d{16}$/.test(cleanedCardNumber)) {
    return "Número de cartão inválido";
  }

  const maskedCardNumber = "**** **** **** " + cleanedCardNumber.slice(-4);

  return maskedCardNumber;
}
