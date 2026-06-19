import { toast } from "sonner";

export const TOAST = {
  ERROR: (message: string) =>
    toast.error(message, {
      duration: 5000,
      icon: "",
      position: "top-center",
      style: {
        border: "1px solid oklch(0.577 0.245 27.325)",
        borderRadius: "16px",
        height: "auto",
        color: "oklch(0.577 0.245 27.325)",
        backgroundColor: "#azure",
        maxWidth: "400px",
        minWidth: "12rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        justifyContent: "center",
        margin: "auto",
      },
    }),
  SUCCESS: (message: string) =>
    toast.success(message, {
      duration: 2000,
      position: "top-center",
      style: {
        border: "2px solid oklch(0.723 0.219 149.579)",
        borderRadius: "16px",
        height: "auto",
        color: "green",
        backgroundColor: "#azure",
        maxWidth: "400px",
        minWidth: "12rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        justifyContent: "center",
        margin: "auto",
      },
    }),
  INFO: (message: string) =>
    toast.info(message, {
      duration: 2000,
      position: "top-center",
      style: {
        border: "4px solid oklch(0.6413 0.154 245.33)",
        borderRadius: "16px",
        fontSize: "14px",
        height: "auto",
        color: "#333",
        textAlign: "center",
        backgroundColor: "#azure",
        maxWidth: "400px",
        minWidth: "12rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        justifyContent: "center",
        margin: "auto",
      },
    }),
  PENDING: (message: string) =>
    toast.info(message, {
      duration: Infinity,
      position: "top-center",
      style: {
        border: "4px solid oklch(0.6413 0.154 245.33)",
        borderRadius: "16px",
        fontSize: "14px",
        height: "auto",
        color: "#333",
        textAlign: "center",
        backgroundColor: "#azure",
        maxWidth: "400px",
        minWidth: "12rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        justifyContent: "center",
        margin: "auto",
      },
    }),
  PROMISE: (promise: Promise<unknown>, messageSuccess: string) =>
    toast.promise(promise, {
      loading: "Выполняется...",
      success: {
        message: messageSuccess,
        style: {
          border: "1px solid oklch(0.723 0.219 149.579)",
          borderRadius: "16px",
          color: "green",
          maxWidth: "400px",
          display: "flex",
          justifyContent: "center",
        },
      },
      error: (err) => {
        return {
          message: err.message || "Произошла ошибка",
          style: {
            border: "1px solid oklch(0.577 0.245 27.325)",
            borderRadius: "30px",
            color: "oklch(0.577 0.245 27.325)",
            maxWidth: "400px",
            display: "flex",
            justifyContent: "center",
          },
        };
      },
      style: {
        backgroundColor: "oklch(0.809 0.105 251.813)",
        margin: "auto",
        maxWidth: "400px",
        display: "flex",
        justifyContent: "center",
      },
      duration: 3000,
      icon: null,
    }),
};
