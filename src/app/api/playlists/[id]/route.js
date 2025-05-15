import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;

    // Validate ID format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid playlist ID format' },
        { status: 400 }
      );
    }

    // Find playlist and populate songs
    const playlist = await db.collection('playlists').aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: 'songs',
          localField: 'songs',
          foreignField: '_id',
          as: 'songs'
        }
      }
    ]).next();

    if (!playlist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(playlist);
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
