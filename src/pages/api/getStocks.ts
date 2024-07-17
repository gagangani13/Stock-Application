// "use server";
import Stock from "@/lib/model/Stock";
import dbConnect from "@/lib/db/dbConnect";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      await dbConnect();

      const symbol = req.query.symbol || "AAPL";

      const data = await Stock.find({ symbol })
        .sort({ timestamp: -1 })
        .limit(20);

      res.status(200).json(data);
      
    } catch (error:any) {
      console.error("Error finding stock:", error);
      res.status(500).json({ message: error.message||"Failed to retrieve stock data" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}



