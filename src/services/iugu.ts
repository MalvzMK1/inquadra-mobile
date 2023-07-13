import axios from 'axios'

export async function generateInvoice(invoice: CreateInvoiceRequestBody): Promise<CreateInvoiceResponse> {
  // const {data} = await axios.post<CreateInvoiceResponse>('http://192.168.0.10:5055/iugu', invoice); 
  const {data} = await axios.post<CreateInvoiceResponse>('https://api.iugu.com/v1/invoices?api_token=9FA9FCA3E948266BDAE1F8E90B3574487122F3E4495792C9BD2E40D56F9EFC0F', invoice); 
  console.log({ID_DA_FATURA: data.id})
  return data
}
