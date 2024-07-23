"use client";
import React, { useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Table,
  Typography,
} from "@mui/material";
import { TableBody } from "@mui/material";
import { TableCell } from "@mui/material";
import { TableContainer } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { Paper } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { stockAction } from "@/lib/store/slice/stockSlice";
import { format } from "date-fns";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}
function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open } = props;
  const symbols = ['AAPL','INFY','TRP','QQQ','IXIC','EUR/USD','USD/JPY','BTC/USD','ETH/BTC'];
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select a Stock</DialogTitle>
      <List>
        {symbols.map((value) => (
          <ListItem
            button
            key={value}
            onClick={() => handleListItemClick(value)}
          >
            <ListItemAvatar>
              <Avatar sx={{ backgroundColor: "#00838F" }}>
                {value.substring(0, 2).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={value} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

const TableComponent = () => {
  const dispatch = useDispatch();
  let data = useSelector((state: RootState) => state.stockReducer.stockData);
  let open = useSelector((state: RootState) => state.stockReducer.open);
  let selectedSymbol = useSelector(
    (state: RootState) => state.stockReducer.selectedSymbol
  );


  const handleClickOpen = () => {
    dispatch(stockAction.setOpen(true));
  };

  const handleClose = (value: string) => {
    dispatch(stockAction.setOpen(true));
    dispatch(stockAction.setSelectedSymbol(value));
    localStorage.setItem("symbol", value);
    // fetchStocks(value)
  };

  useEffect(() => {
    const symbol = localStorage.getItem("symbol") || "AAPL";
    dispatch(stockAction.setSelectedSymbol(symbol));
    let intervalId: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      const data = await fetchStocks(symbol);
      if (data) {
        // Dispatch or use data as needed (e.g., set in Redux state)
        dispatch(stockAction.setStockData(data));
      } else {
        stopFetchInterval();
      }
    };

    const startFetchInterval = () => {
      intervalId = setInterval(async () => {
        await fetchData();
      }, 3000); // Fetch every 3 seconds 
    };

    const stopFetchInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Initial fetch
    fetchData();

    // Start interval
    startFetchInterval();

    // Cleanup function
    return () => {
      stopFetchInterval(); // Clear interval on component unmount or symbol change
    };
  }, [selectedSymbol]);
  useEffect(() => {
    getSocketConnection();
  }, []);

  async function fetchStocks(symbol: string) {
    try {
      const response = await fetch(`/api/getStocks?symbol=${symbol}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch stocks for ${symbol}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching stocks:", error);
      return null;
    }
  }
  async function getSocketConnection() {
    try {
      const response = await fetch(`/api/getSocket`);

      if (!response.ok) {
        throw new Error(`Failed to fetch stocks through web socket`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching stocks:", error);
      return null;
    }
  }

  return (
    <div>
      <header className="d-flex justify-content-center position-fixed top-0 w-100  bg-dark text-light ">
        <h1>Real Time Stock Data</h1>
      </header>
      <Card
        sx={{
          width: "90%",
          overflow: "hidden",
          margin: "10vh auto 10px auto",
        }}
      >
        <CardContent>
          <div className="d-flex justify-content-between my-2">
            <h4>Stock Information</h4>
            <Button
              size="small"
              type="button"
              variant="contained"
              color="success"
              onClick={handleClickOpen}
            >
              Change
            </Button>
          </div>

          <Grid container spacing={3}>
            {data && data[0]&&
              Object.entries(data[0])?.map(([key, value]) => (
                <>
                {typeof value === 'string' && isNaN(Number(value))&&key!=='_id'&&<Grid key={key} item xs={12} sm={6} md={4} lg={3}>
                  <span>
                    <strong>{key.replace("_", " ")} : </strong>{" "}
                    {value as string}
                  </span>
                </Grid>}
                </>
              ))}
          </Grid>
        </CardContent>
      </Card>
      <Paper
        sx={{
          width: "90%",
          overflow: "hidden",
          margin: "10px auto",
          background: "#e1eaf2",
        }}
      >
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead sx={{ background: "#3c3e3e" }}>
              <TableRow>
                <TableCell align="left">SL.No</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Time</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row: any, index: number) => (
                <TableRow
                  key={row.time}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "#d1e7f2",
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell align="right">
                  {format(new Date(row.timestamp*1000), 'MMMM do yyyy')}
                  </TableCell>
                  <TableCell align="right">
                  {format(new Date(row.timestamp*1000), 'h:mm:ss a')}
                  </TableCell>
                  <TableCell align="right">
                    {row.price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <SimpleDialog
        selectedValue={selectedSymbol}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
};

export default TableComponent;
