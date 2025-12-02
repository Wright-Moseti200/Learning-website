// const fetch = require('node-fetch'); // Native fetch used

const API_URL = 'http://localhost:5000/api';

async function test() {
    console.log('--- Starting Verification ---');

    // 1. Test Invalid Token (Bearer null)
    console.log('\n1. Testing Invalid Token (Bearer null) on Student Dashboard...');
    try {
        const res = await fetch(`${API_URL}/student/dashboard`, {
            headers: { 'Authorization': 'Bearer null' }
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log(`Message: ${data.message}`);
        if (res.status === 401 && data.message === 'Not authorized, no token') {
            console.log('PASS: Handled "Bearer null" correctly.');
        } else {
            console.log('FAIL: Did not handle "Bearer null" as expected.');
        }
    } catch (err) {
        console.error('Error:', err.message);
    }

    // 2. Student Signup
    const studentEmail = `teststudent_${Date.now()}@example.com`;
    let studentToken = '';
    console.log(`\n2. Testing Student Signup (${studentEmail})...`);
    try {
        const res = await fetch(`${API_URL}/student/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: 'Test Student',
                email: studentEmail,
                password: 'password123'
            })
        });
        const data = await res.json();
        if (res.ok && data.token) {
            console.log('PASS: Student Signup successful.');
            studentToken = data.token;
        } else {
            console.log('FAIL: Student Signup failed.', data);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }

    // 3. Student Dashboard (Valid Token)
    if (studentToken) {
        console.log('\n3. Testing Student Dashboard (Valid Token)...');
        try {
            const res = await fetch(`${API_URL}/student/dashboard`, {
                headers: { 'Authorization': `Bearer ${studentToken}` }
            });
            if (res.ok) {
                console.log('PASS: Student Dashboard access successful.');
            } else {
                console.log('FAIL: Student Dashboard access failed.', await res.json());
            }
        } catch (err) {
            console.error('Error:', err.message);
        }
    }

    // 4. Educator Signup
    const educatorEmail = `testeducator_${Date.now()}@example.com`;
    let educatorToken = '';
    console.log(`\n4. Testing Educator Signup (${educatorEmail})...`);
    try {
        const res = await fetch(`${API_URL}/educator/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: 'Test Educator',
                email: educatorEmail,
                password: 'password123',
                specialization: 'Testing'
            })
        });
        const data = await res.json();
        if (res.ok && data.token) {
            console.log('PASS: Educator Signup successful.');
            educatorToken = data.token;
        } else {
            console.log('FAIL: Educator Signup failed.', data);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }

    // 5. Create Course
    if (educatorToken) {
        console.log('\n5. Testing Create Course...');
        try {
            const res = await fetch(`${API_URL}/educator/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${educatorToken}`
                },
                body: JSON.stringify({
                    title: 'Test Course',
                    description: 'A test course',
                    price: 10,
                    category: 'Tech',
                    level: 'Beginner',
                    thumbnail: 'http://example.com/image.jpg',
                    modules: []
                })
            });
            const data = await res.json();
            if (res.ok) {
                console.log('PASS: Create Course successful.');
            } else {
                console.log('FAIL: Create Course failed.', data);
            }
        } catch (err) {
            console.error('Error:', err.message);
        }
    }

    console.log('\n--- Verification Complete ---');
}

test();
