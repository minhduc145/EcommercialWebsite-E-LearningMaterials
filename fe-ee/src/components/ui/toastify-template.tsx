import { useEffect } from "react";
import { toast, ToastContainer, Zoom } from "react-toastify";


export default function MyToaster(variant?: string | undefined, message?: string) {
    if (!variant || variant === "info") {
        toast.info(
            <div className="max-w-full">
                <p className="font-bold">Thông báo:</p>
                <p className="line-clamp-3 break-words">{message}</p>
            </div>
            , {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Zoom,
            });
    }
    else if (variant === "error") {
        toast.error(<div className="white-space: pre-line;">
            Thất bại
            <br />
            {message && message}
        </div>, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
    else if (variant === "success") {
        toast.success(<div>
            Thành công
            <br />
            {message && message}
        </div>, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    } else if (variant === "warn") {
        toast.warn(<div>
            Cảnh báo:
            <br />
            {message && message}
        </div>, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
}