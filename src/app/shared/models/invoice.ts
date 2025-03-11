export interface Invoice {
    nf: string;
    products: InvoiceItem[];
    type: 'IN' | 'OUT';
}

export interface InvoiceItem {
    serialNumber: string;
    name: string;
    price: number;
    quantity: number;
    discount: number;
    productId?: number;
}