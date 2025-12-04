"use strict";
// Example TypeScript file for testing the Boolean Search extension
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUsers = exports.UserService = void 0;
exports.mapArray = mapArray;
exports.validateUser = validateUser;
// Test 3: Generic functions (search: "function AND <")
function mapArray(array, mapper) {
    return array.map(mapper);
}
// Test 4: Async/await patterns (search: "async AND await")
async function loadUserProfile(userId) {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    return data;
}
// Test 5: Class with decorators (search: "class AND @")
// @Component
class UserService {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }
    async getUser(id) {
        // Implementation here
        return {};
    }
}
exports.UserService = UserService;
// Test 6: Error handling (search: "throw AND new")
function validateUser(user) {
    if (!user.email) {
        throw new Error('Email is required');
    }
    if (!user.name) {
        throw new Error('Name is required');
    }
}
// Test 7: Optional chaining (search: "?.")
function getUserEmail(user) {
    return user?.email;
}
// Test 10: Arrow functions (search: "const AND =>")
const processUsers = (users) => {
    return users.filter(user => user.email.includes('@'));
};
exports.processUsers = processUsers;
//# sourceMappingURL=example2.js.map