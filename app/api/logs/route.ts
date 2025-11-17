import { NextResponse } from 'next/server';
import getDb from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Expecting { level?: string, message: string, meta?: object, timestamp?: string }
    const { level = 'info', message, meta = {}, timestamp } = body;
    if (!message) {
      return NextResponse.json({ error: '`message` is required' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('logs');
    const doc = {
      level,
      message,
      meta,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    };
    const result = await collection.insertOne(doc);
    return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
  } catch (err: unknown) {
    console.error('POST /api/logs error', err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');
    const level = url.searchParams.get('level');

    const db = await getDb();
    const collection = db.collection('logs');

    type TimestampQuery = { $gte?: Date; $lte?: Date };
    const query: { level?: string; timestamp?: TimestampQuery } = {};
    if (level) query.level = level;
    if (start || end) {
      const tq: TimestampQuery = {};
      if (start) tq.$gte = new Date(start);
      if (end) tq.$lte = new Date(end);
      query.timestamp = tq;
    }

    const limit = Number(url.searchParams.get('limit') || '100');
  const sort: Record<string, 1 | -1> = { timestamp: -1 };

    const docs = await collection.find(query).sort(sort).limit(limit).toArray();
    return NextResponse.json({ count: docs.length, logs: docs });
  } catch (err: unknown) {
    console.error('GET /api/logs error', err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
