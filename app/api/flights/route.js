import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');

  if (!origin || !destination) {
    return NextResponse.json(
      { error: 'Missing origin or destination' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `https://seats.aero/api/search?origin_airports=${origin}&destination_airports=${destination}&cabin=business`,
      {
        headers: {
          'Partner-Authorization': process.env.SEATS_AERO_API_KEY,
          Accept: 'application/json',
          'User-Agent': 'TravelRewardsOptimizer/1.0',
        },
      }
    );

    // Axios automatically parses JSON, so we skip response.json()
    const flights = response.data.data || [];
    const pointsArray = flights
      .map((flight) => flight.JPoints)
      .filter((p) => p > 0);

    if (pointsArray.length === 0) {
      return NextResponse.json({ saver: 'N/A', typical: 'N/A' });
    }

    const saverPrice = Math.min(...pointsArray);
    const sum = pointsArray.reduce((a, b) => a + b, 0);
    const averagePrice = Math.round(sum / pointsArray.length);

    return NextResponse.json({
      saver: saverPrice,
      typical: averagePrice,
    });
  } catch (error) {
    console.error('Seats.aero API Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch flight data' },
      { status: 500 }
    );
  }
}
