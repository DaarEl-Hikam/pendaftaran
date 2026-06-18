exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Hanya menerima POST.' }) };
    }

    try {
        const body = JSON.parse(event.body);
        const target = body.target;
        const pesan = body.pesan;
        const urlGambar = body.urlGambar; // Menerima link foto yang diupload dari form

        let nomorHP = target;
        if (target.includes('@s.whatsapp.net')) {
            nomorHP = target.split('@')[0];
        }

        // Susun struktur data payload untuk Fonnte
        const payload = { 
            target: nomorHP, 
            message: pesan, 
            countryCode: '62' 
        };

        // Jika pendaftar menyertakan foto, masukkan parameter url media ke Fonnte
        if (urlGambar) {
            payload.url = urlGambar;
        }

        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': process.env.FONNTE_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.status) {
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        } else {
            return { statusCode: 400, body: JSON.stringify({ success: false, message: data.reason }) };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
    }
};
