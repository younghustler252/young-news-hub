const codeStore = {}

const saveCode = (key, code) => {
    codeStore[key] = {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };
    
};


const verifyCode = (key, inputCode) => {
    const entry = codeStore[key];
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
        delete codeStore[key]; // cleanup expired code
        return false;
    }

    const isMatch = entry.code === inputCode;

    if (isMatch) {
        delete codeStore[key]; // ✅ cleanup after successful match
    }

    return isMatch;
};



module.exports = { saveCode, verifyCode };
