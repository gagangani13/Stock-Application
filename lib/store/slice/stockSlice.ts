
import { StockEvent } from "@/lib/model/Stock";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: StockEvent|any = {
    stockData: null,
    selectedSymbol: null,
    open: false
};

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setStockData(state, action: PayloadAction<StockEvent>) {
      state.stockData = action.payload;
    },
    setSelectedSymbol(state, action: PayloadAction<string>) {
      state.selectedSymbol = action.payload;
    },
    setOpen(state, action: PayloadAction<boolean>) {
      state.open = action.payload;
    },
  },
});

export const stockAction = stockSlice.actions;
export const stockReducer = stockSlice.reducer;
export default stockSlice;
