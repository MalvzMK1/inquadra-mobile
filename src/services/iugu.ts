import axios from 'axios'

export async function generateInvoice(invoice: CreateInvoiceRequestBody): Promise<CreateInvoiceResponse> {
  const {data} = await axios.post<CreateInvoiceResponse>('https://a99a-2804-14d-3280-54ef-9095-8ad3-200d-607e.ngrok-free.app/iugu', invoice);
  console.log({ID_DA_FATURA: data.id})
  return data
}
