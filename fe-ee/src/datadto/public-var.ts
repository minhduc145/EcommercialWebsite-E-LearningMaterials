const publicVar: {
    userSwt?: string;
  } = {};
  
  export default publicVar;
  
  export const link_google_login = "http://localhost:8080/oauth2/authorization/google";


  export function formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }