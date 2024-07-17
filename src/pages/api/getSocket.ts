// pages/api/stocks.ts

import dbConnect from '@/lib/db/dbConnect';
import Stock from '@/lib/model/Stock';
import { NextApiRequest, NextApiResponse } from 'next';
import WebSocket from 'ws';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      
      // Create a WebSocket client instance
      const ws = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?apikey=${process.env.API_KEY}`);
      // Handle WebSocket events
      ws.on('open', async() => {
        console.log('Connected to Twelve Data WebSocket');
        
        // Subscription payload
        const subscribePayload = JSON.stringify({
          action: 'subscribe',
          params: {
            symbols: 'AAPL,INFY,TRP,QQQ,IXIC,EUR/USD,USD/JPY,BTC/USD,ETH/BTC'
          }
        });
        await dbConnect();
        // Send subscription payload after WebSocket is open
        ws.send(subscribePayload);
      });
      ws.on('message', async(data: WebSocket.Data) => {
        const parsedData = JSON.parse(data.toString());
          // Create a new stock document in the database
          await Stock.create(parsedData);
      });

      ws.on('close', () => {
        console.log('Disconnected from Twelve Data WebSocket');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        // Handle WebSocket connection errors
        res.status(500).json({ message: 'WebSocket connection error.' });
      });

      // Respond to the API request
      res.status(200).json({ message: 'WebSocket connection initiated.' });
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      res.status(500).json({ message: 'Failed to initiate WebSocket connection.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
