
function getValue(id: string, value: string): string {
    const size = String(value.length).padStart(2, '0');
    return `${id}${size}${value}`;
 }

 function getCRC16(payload: string): string {
        const ID_CRC16: string = '63';
    
        // ADICIONA DADOS GERAIS NO PAYLOAD
        payload += ID_CRC16 + '04';
    
        // DADOS DEFINIDOS PELO BACEN
        const polinomio: number = 0x1021;
        let resultado: number = 0xFFFF;
    
        // CHECKSUM
        if (payload.length > 0) {
        for (let offset = 0; offset < payload.length; offset++) {
            resultado ^= payload.charCodeAt(offset) << 8;
            for (let bitwise = 0; bitwise < 8; bitwise++) {
            if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
            resultado &= 0xFFFF;
            }
        }
        }
    
        // RETORNA CÓDIGO CRC16 DE 4 CARACTERES
        return ID_CRC16 + '04' + resultado.toString(16).toUpperCase();
    }


export function payload(pixKey: string, description: string, merchantName: string, merchantCity: string, txId: string, value: string):string {
    const ID_PAYLOAD_FORMAT_INDICATOR = '00';
    const ID_MERCHANT_ACCOUNT_INFORMATION = '26';
    const ID_MERCHANT_ACCOUNT_INFORMATION_GUI = '00';
    const ID_MERCHANT_ACCOUNT_INFORMATION_KEY = '01';
    const ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION = '02';
    const ID_MERCHANT_CATEGORY_CODE = '52';
    const ID_TRANSACTION_CURRENCY = '53';
    const ID_TRANSACTION_AMOUNT = '54';
    const ID_COUNTRY_CODE = '58';
    const ID_MERCHANT_NAME = '59';
    const ID_MERCHANT_CITY = '60';
    const ID_ADDITIONAL_DATA_FIELD_TEMPLATE = '62';
    const ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID = '05';

    let gui                 = getValue(ID_MERCHANT_ACCOUNT_INFORMATION_GUI, 'br.gov.bcb.pix')
    let key                 = getValue(ID_MERCHANT_ACCOUNT_INFORMATION_KEY, pixKey)
    let descriptionValue    = description === '' || description === null ? '' : getValue(ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION, description)
    let accountValues       = getValue(ID_MERCHANT_ACCOUNT_INFORMATION,`${gui}${key}${descriptionValue}`)

    let txid                = getValue(ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID, txId)
    let additionalIdField   = getValue(ID_ADDITIONAL_DATA_FIELD_TEMPLATE, txid)

    let payload =
    `${getValue(ID_PAYLOAD_FORMAT_INDICATOR, '01')}${accountValues}${getValue(ID_MERCHANT_CATEGORY_CODE,'0000')}${getValue(ID_TRANSACTION_CURRENCY, '986')}${getValue(ID_TRANSACTION_AMOUNT, value)}${getValue(ID_COUNTRY_CODE,'BR')}${getValue(ID_MERCHANT_NAME, merchantName)}${getValue(ID_MERCHANT_CITY, merchantCity)}${additionalIdField}`

    
    return `${payload}${getCRC16(payload)}`
}

console.log(payload('+5511990216755', 'boa', 'Enzo Diogenes do Prado', 'OSASCO', '44647797864', '700.00'))

