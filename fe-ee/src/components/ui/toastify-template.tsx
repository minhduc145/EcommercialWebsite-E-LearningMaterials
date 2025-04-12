import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

interface IProps {
    variant: string,
    message: string
}
export default function MyToaster(props: IProps) {
        if (props.variant && props.variant === "error") {
            toast.error(<div>
                Thất bại:
                <br />
                {props.message}
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
        else if (props.variant && props.variant === "success") {
            toast.success(<div>
                Thành công:
                <br />
                {props.message}
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