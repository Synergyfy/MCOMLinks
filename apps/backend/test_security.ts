
async function testSecurity() {
    const endpoints = [
        'http://localhost:3000/admin/stats',
        'http://localhost:3000/agent/stats',
        'http://localhost:3000/dashboard/stats',
        'http://localhost:3000/admin/locations',
        'http://localhost:3000/admin/merchants',
    ];

    console.log('Testing security boundaries...');

    for (const url of endpoints) {
        try {
            const response = await fetch(url);
            if (response.status === 401) {
                console.log(`✅ SUCCESS: ${url} blocked with 401 Unauthorized.`);
            } else {
                console.error(`❌ FAILURE: ${url} reached with status: ${response.status}`);
            }
        } catch (error: any) {
             console.log(`⚠️ ERROR: Failed to reach ${url}. Is the server running?`);
        }
    }
}

testSecurity();
