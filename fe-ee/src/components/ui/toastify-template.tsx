import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";


export default function MyToaster(variant:string|undefined,message:string) {
    if (!variant) {
        toast.info(<div>
            Thông báo:
            <br />
            {message&&message}
        </div>, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
    else if (variant === "error") {
        toast.error(<div>
            Thất bại
            <br />
            {message&&message}
        </div>, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
    else if (variant === "success") {
        toast.success(<div>
            Thành công
            <br />
            {message&&message}
        </div>, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    } else if (variant === "warn") {
        toast.warn(<div>
            Cảnh báo:
            <br />
            {message&&message}
        </div>, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
}