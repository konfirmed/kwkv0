// Import required modules
import express, { Request, Response, NextFunction } from 'express';

// Create an instance of Express
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Route handler for POST requests to /api/loaf
app.post('/api/loaf', (req: Request, res: Response) => {
  // Assuming you have some data to return
  const responseData = {
    message: 'Data successfully received',
    data: req.body, // Assuming you want to echo back the received data
  };

  // Send JSON response
  res.status(200).json(responseData);
});

// Route handler for GET requests to /api/loaf
app.get('/api/loaf', (req: Request, res: Response<any, Record<string, any>>) => {
    // Assuming you want to send some data
    const responseData = {
        message: 'Data successfully retrieved',
        data: { example: 'data' },
    };

    // Send JSON response
    res.status(200).json(responseData);
});

// Error handler middleware
app.use((err: any, req: Request, res: express.Response<any, Record<string, any>>, next: NextFunction) => {
    // Log the error
    console.error(err);

    // Send JSON error response
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
