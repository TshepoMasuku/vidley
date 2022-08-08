import auth from './authService';

export const registerUser = async (user) => {
    await auth.registerUser(user);
}
