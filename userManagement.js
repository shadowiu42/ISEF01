// userManagement.js

// Predefined users
const users = [
    { email: 'user1@example.com', password: 'password1' },
    { email: 'user2@example.com', password: 'password2' }
];

function validateUser(email, password) {
    return users.some(user => user.email === email && user.password === password);
}
