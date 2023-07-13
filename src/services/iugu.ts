import axios from 'axios'

export async function generateInvoice(invoice: CreateInvoiceRequestBody): Promise<CreateInvoiceResponse> {
  console.log(invoice)
  const data = await axios.post('http://192.168.0.10:5055/iugu', invoice) as CreateInvoiceResponse; 
  return data
}