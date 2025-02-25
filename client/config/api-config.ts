const IP_BASE_URL = `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:${process.env.EXPO_PUBLIC_PORT}`;
const NGROK_BASE_URL = `${process.env.EXPO_PUBLIC_NGROK_URL}`;

const CARS_IP_BASE_URL = `${IP_BASE_URL}/cars`;
const CARS_NGROK_BASE_URL = `${NGROK_BASE_URL}/cars`;

export { IP_BASE_URL, NGROK_BASE_URL, CARS_IP_BASE_URL, CARS_NGROK_BASE_URL };
