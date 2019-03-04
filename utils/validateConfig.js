module.exports.validateConfig = function validateConfig(config) {
    const params = [
        "VIRGIL_APP_ID",
        "VIRGIL_API_KEY",
        "VIRGIL_API_KEY_ID",
        "TWILIO_ACCOUNT_SID",
        "TWILIO_CHAT_API_SECRET",
        "TWILIO_CHAT_API_KEY",
        "TWILIO_CHAT_SERVICE_SID"
    ];

    return params.reduce((missingParams, param) => {
        const value = config[param]
        if (!value || value === '') missingParams.push(param);
        return missingParams;
    }, []);
}
