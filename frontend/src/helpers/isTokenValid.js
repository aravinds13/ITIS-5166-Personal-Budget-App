const isTokenValid = (token) => {
    try {
        const [, payload] = token.split('.');
        const decodedToken = JSON.parse(atob(payload));
        if(decodedToken){
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (decodedToken.exp > currentTimestamp) {
                const timeLeft = decodedToken.exp - currentTimestamp;
                return timeLeft
            }
            else{
                return false
            }
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

export default isTokenValid;
