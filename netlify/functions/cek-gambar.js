// File: netlify/functions/cek-gambar.js
exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Hanya menerima POST.' }) };
    }

    try {
        const body = JSON.parse(event.body);
        const base64Image = body.image.split(',')[1]; // Membuang prefix 'data:image/jpeg;base64,'

        // Masukkan kredensial Sightengine Anda di sini
        const apiUser = '830381970'; 
        const apiSecret = 'QGTtcwAftunzh9SgAbo53u9pPch8G7o2';

        // Kita gunakan AI model 'scam' dan 'gore' (manipulasi/berbahaya)
        const formData = new URLSearchParams();
        formData.append('api_user', apiUser);
        formData.append('api_secret', apiSecret);
        formData.append('models', 'scam,gore'); 
        formData.append('base64', base64Image);

        const response = await fetch('https://api.sightengine.com/1.0/check.json', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.status === 'success') {
            // Logika Deteksi: Jika AI yakin lebih dari 70% ini gambar scam/manipulatif/palsu
            if (data.scam && data.scam.prob > 0.7) {
                return { 
                    statusCode: 200, 
                    body: JSON.stringify({ status: false, pesan: 'Ditolak: Terdeteksi gambar tidak valid atau hasil manipulasi (Scam).' }) 
                };
            }
            
            // Jika aman
            return { 
                statusCode: 200, 
                body: JSON.stringify({ status: true, pesan: 'Lolos verifikasi keamanan AI.' }) 
            };
        } else {
            return { statusCode: 400, body: JSON.stringify({ status: false, pesan: 'AI Gagal memproses gambar.' }) };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ status: false, pesan: 'Server Error: ' + error.message }) };
    }
};
