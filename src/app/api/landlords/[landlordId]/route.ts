import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ landlordId: string }> }
) {
  try {
    const { landlordId } = await params;
    
    const landlord = db.getLandlord(landlordId);
    
    return NextResponse.json({
      exists: !!landlord,
      name: landlord?.name,
    });
  } catch (error) {
    console.error('Error validating landlord:', error);
    return NextResponse.json(
      { exists: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
