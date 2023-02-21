//GENERATE OTP
function generateOtp (len) {
    const digits = `0123456789`;
    let OTP = '';
    for (let i = 0; i < len; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }

    return OTP;
};


module.exports = generateOtp;