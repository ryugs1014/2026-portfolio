// app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    if (!process.env.GMAIL_APP_PASSWORD) {
      throw new Error('GMAIL_APP_PASSWORD 환경 변수가 설정되지 않았습니다.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ryugs1014@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions: any = {
      from: '"포트폴리오 웹사이트" <ryugs1014@gmail.com>',
      to: 'ryugs1014@gmail.com',
      replyTo: email,
      subject: `[포트폴리오 문의] ${company} - ${name}님의 문의입니다.`,
      text: `
포트폴리오 웹사이트에서 새로운 문의가 접수되었습니다.

이름: ${name}
기업명: ${company}
연락처: ${phone}
이메일: ${email}

문의 내용:
${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
