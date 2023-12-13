function getValue(id, value) {
  var size = String(value.length).padStart(2, "0");
  return "".concat(id).concat(size).concat(value);
}
function getCRC16(payload) {
  var ID_CRC16 = "63";
  // ADICIONA DADOS GERAIS NO PAYLOAD
  payload += ID_CRC16 + "04";
  // DADOS DEFINIDOS PELO BACEN
  var polinomio = 0x1021;
  var resultado = 0xffff;
  // CHECKSUM
  if (payload.length > 0) {
    for (var offset = 0; offset < payload.length; offset++) {
      resultado ^= payload.charCodeAt(offset) << 8;
      for (var bitwise = 0; bitwise < 8; bitwise++) {
        if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
        resultado &= 0xffff;
      }
    }
  }
  // RETORNA CÓDIGO CRC16 DE 4 CARACTERES
  return ID_CRC16 + "04" + resultado.toString(16).toUpperCase();
}
var payload = function (
  pixKey,
  description,
  merchantName,
  merchantCity,
  txId,
  value
) {
  var ID_PAYLOAD_FORMAT_INDICATOR = "00";
  var ID_MERCHANT_ACCOUNT_INFORMATION = "26";
  var ID_MERCHANT_ACCOUNT_INFORMATION_GUI = "00";
  var ID_MERCHANT_ACCOUNT_INFORMATION_KEY = "01";
  var ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION = "02";
  var ID_MERCHANT_CATEGORY_CODE = "52";
  var ID_TRANSACTION_CURRENCY = "53";
  var ID_TRANSACTION_AMOUNT = "54";
  var ID_COUNTRY_CODE = "58";
  var ID_MERCHANT_NAME = "59";
  var ID_MERCHANT_CITY = "60";
  var ID_ADDITIONAL_DATA_FIELD_TEMPLATE = "62";
  var ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID = "05";
  var gui = getValue(ID_MERCHANT_ACCOUNT_INFORMATION_GUI, "br.gov.bcb.pix");
  var key = getValue(ID_MERCHANT_ACCOUNT_INFORMATION_KEY, pixKey);
  var descriptionValue =
    description === "" || description === null
      ? ""
      : getValue(ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION, description);
  var accountValues = getValue(
    ID_MERCHANT_ACCOUNT_INFORMATION,
    "".concat(gui).concat(key).concat(descriptionValue)
  );
  var txid = getValue(ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID, txId);
  var additionalIdField = getValue(ID_ADDITIONAL_DATA_FIELD_TEMPLATE, txid);
  var payload = ""
    .concat(getValue(ID_PAYLOAD_FORMAT_INDICATOR, "01"))
    .concat(accountValues)
    .concat(getValue(ID_MERCHANT_CATEGORY_CODE, "0000"))
    .concat(getValue(ID_TRANSACTION_CURRENCY, "986"))
    .concat(getValue(ID_TRANSACTION_AMOUNT, value))
    .concat(getValue(ID_COUNTRY_CODE, "BR"))
    .concat(getValue(ID_MERCHANT_NAME, merchantName))
    .concat(getValue(ID_MERCHANT_CITY, merchantCity))
    .concat(additionalIdField);
  return "".concat(payload).concat(getCRC16(payload));
};
