// Example JavaScript file for testing the Boolean Search extension

// Test 1: Function exports (search: "function AND export")
export function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}

// Test 2: Error handling (search: "error OR exception")
function processData(data) {
    try {
        if (!data) {
            throw new Error('Data is required');
        }
        return parseData(data);
    } catch (exception) {
        console.error('Failed to process data:', exception);
        return null;
    }
}

// Test 3: Console without log (search: "console NOT log")
function debugInfo(message) {
    console.warn('Warning:', message);
    console.error('This is an error');
}

// Test 4: Async functions (search: "async AND function")
async function fetchUserData(userId) {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
}

// Test 5: Class definitions (search: "class AND extends")
class UserManager extends BaseManager {
    constructor() {
        super();
        this.users = [];
    }
}

// Test 6: Import statements (search: "import")
// import React from 'react';
// import { useState, useEffect } from 'react';

// Test 7: TODO comments (search: "TODO OR FIXME")
// TODO: Add input validation
// FIXME: Handle edge case for empty arrays
// HACK: Temporary workaround for API issue

export { processData, fetchUserData };

