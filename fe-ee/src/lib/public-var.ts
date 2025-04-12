const publicVar: {
    userSwt?: string;
  } = {};
  
  export default publicVar;
  
  export const url_backend_default = "http://localhost:8080/"

  export const link_google_login = "http://localhost:8080/oauth2/authorization/google";

  export const link_logout = "http://localhost:8080/accounts/logout";


  export function formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }