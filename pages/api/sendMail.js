import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

        // console.log('Received request:', req.body);
        const { 
            concertTitle, 
            name, 
            email, 
            contact,
            ticketCount,
        } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.NEXT_PUBLIC_GMAIL_USER,
        pass: process.env.NEXT_PUBLIC_GMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
        from: `"${name}" <${email}>`,
        //   to: "hgchang1@naver.com",
            to: "jwgo0311@gmail.com",
        // 참조
        cc: `${req.body.email}`,
        subject: `공연 예매 요청 메일 | ${concertTitle} | ${name}`,
        text: `
                예매 요청 \n
                콘서트 제목: ${concertTitle}
                이름: ${name}
                연락처: ${contact}
                요청 티켓 수랑: ${ticketCount}
                이메일: ${email}
            `
        });

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Email send failed:', err);
        res.status(500).json({ success: false, error: err.message });
    }
}
