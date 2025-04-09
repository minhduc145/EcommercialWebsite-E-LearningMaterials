const publicVar: {
    userSwt?: string;
  } = {};
  
  export default publicVar;
  
  export function formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }