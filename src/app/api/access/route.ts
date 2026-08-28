// app/api/access/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currentUrl, referrer } = body;

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: 'Webhook URL 없음' }, { status: 500 });
    }

    const now = new Date();
    const kstTime = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(now);

    const embed = {
      title: 'Portfolio Access Log',
      color: 3447003,
      fields: [
        { name: 'Time (KST)', value: kstTime, inline: false },
        { name: 'URL', value: currentUrl || 'Unknown', inline: false },
        {
          name: 'OS',
          value: referrer || '직접 접속 (또는 알 수 없음)',
          inline: false,
        },
      ],
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Alarm Send Failed' }, { status: 500 });
  }
}
