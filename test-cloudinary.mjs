import fs from 'fs';

async function testCloudinaryUpload(resourceType) {
    console.log(`Testing upload with resourceType: ${resourceType}`);
    
    // Create a very basic valid 1-page PDF file in memory
    const pdfContent = Buffer.from(
        "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources <<>> /MediaBox [0 0 612 792] >>\nendobj\n4 0 obj\n<< /Length 0 >>\nstream\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n253\n%%EOF",
        "utf8"
    );

    const formData = new FormData();
    formData.append('upload_preset', 'dvnpwvzs');
    formData.append('folder', 'project_pdfs');
    // Using a valid blob constructor since we are using Node's Fetch and FormData
    formData.append('file', new Blob([pdfContent], { type: 'application/pdf' }), 'dummy.pdf');

    try {
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/dv5hthm2t/${resourceType}/upload`,
            { method: 'POST', body: formData }
        );
        
        const result = await res.json();
        
        if (!res.ok) {
            console.error(`ERROR for ${resourceType}:`, result.error.message);
        } else {
            console.log(`SUCCESS for ${resourceType}:`, result.secure_url);
        }
    } catch (e) {
        console.error(`FETCH EXCEPTION for ${resourceType}:`, e);
    }
}

async function runTests() {
    await testCloudinaryUpload('image');
    await testCloudinaryUpload('raw');
    await testCloudinaryUpload('auto');
}

runTests();
