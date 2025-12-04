// Example TypeScript file for testing the Boolean Search extension

// Test 1: Interface and export (search: "interface AND export")
export interface User {
    id: number;
    name: string;
    email: string;
}

// Test 2: Type definitions (search: "type AND =")
type UserRole = 'admin' | 'user' | 'guest';
type Callback = (data: any) => void;

// Test 3: Generic functions (search: "function AND <")
export function mapArray<T, U>(array: T[], mapper: (item: T) => U): U[] {
    return array.map(mapper);
}

// Test 4: Async/await patterns (search: "async AND await")
async function loadUserProfile(userId: number): Promise<User> {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    return data as User;
}

// Test 5: Class with decorators (search: "class AND @")
// @Component
class UserService {
    constructor(private apiUrl: string) {}
    
    async getUser(id: number): Promise<User> {
        // Implementation here
        return {} as User;
    }
}

// Test 6: Error handling (search: "throw AND new")
function validateUser(user: User): void {
    if (!user.email) {
        throw new Error('Email is required');
    }
    if (!user.name) {
        throw new Error('Name is required');
    }
}

// Test 7: Optional chaining (search: "?.")
function getUserEmail(user?: User): string | undefined {
    return user?.email;
}

// Test 8: Readonly properties (search: "readonly AND :")
interface Config {
    readonly apiKey: string;
    readonly timeout: number;
}

// Test 9: Union types (search: "|" would work)
type Result = User | null | undefined;

// Test 10: Arrow functions (search: "const AND =>")
const processUsers = (users: User[]) => {
    return users.filter(user => user.email.includes('@'));
};

export { UserService, validateUser, processUsers };

