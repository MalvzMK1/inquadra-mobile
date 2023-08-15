type CreateInvoiceRequestBody = {
	email: string
	due_date: string
	items: {
		description: string
		quantity: number
		price_cents: number
	}[]
	payer: {
		cpf_cnpj: string
		name: string
		phone_prefix: string
		phone: string
		email: string
		address: {
			zip_code: string
			street: string
			number: string
			district: string
			city: string
			state: string
			country: string
			complement: string
		}
	}
	payable_with: string[]
	order_id: string
}

type CreateInvoiceResponse = {
	id: string
	dueDate: string
	accountId: string
	secureId: string
	accountName: string
	secureUrl: string
	bankAccountBranch: string
	bankAccountNumber: string
	currency: string
	discountCents: string | number | null 
	email: string
	itemsTotalCents: number
	notificationUrl: string | null
	returnUrl: string | null
	status: string
	items: {
		id: string
		description: string
		priceCents: number
		quantity: number
		createdAt: string
		updatedAt: string
		price: string
	}[]
	variables: {
		variableName: string
		value: string
	}[]
	logs: {
		id: string
		description: string
		notes: string
		createdAt: string
	}[]
	creditCardTransaction: string | null
}

enum EPayableWith {
	PIX = 'pix',
	CREDIT_CARD = 'credit_card',
}

type PayableWith = keyof typeof EPayableWith;

const pay: PayableWith = ''
