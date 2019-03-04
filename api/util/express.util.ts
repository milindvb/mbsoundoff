
export const logAndSendError = (res, errorMsg, error?) => {
    console.error(errorMsg, error);
    if (res) {
        res.status(500).send(errorMsg);
    }
}