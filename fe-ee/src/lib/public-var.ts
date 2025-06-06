const publicVar: {
    userSwt?: string;
  } = {};
  
  export default publicVar;
  
  export const url_backend_default = "http://localhost:8080"
    // export const url_backend_default = "http://192.168.1.61:8080"


  export const link_google_login = url_backend_default+"/oauth2/authorization/google";

  export const link_logout = url_backend_default+"/accounts/logout";

  export const link_r2_default = "https://pub-e96712ffb5c644eab6d6682c1ebe8bf3.r2.dev"


  export function formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }