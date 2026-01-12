import express, { NextFunction, type Request, type Response } from "express";
import {
  createProduct,
  deleteProduct,
  getMovements,
  getProducts,
  stockDecrease,
  stockIncrease,
  updateProduct,
} from "./productServices.js";

const app = express();
app.use(express.json());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(502).json({ error: "Can't communicate with microservice" });
});

app.get(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getProducts();

      if (!result.ok) {
        return res.status(result.status).json({
          error: "Error from microservice",
          detail: result.data.detail,
        });
      }
      res.status(result.status).json(result.data);
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  "/product",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await createProduct(req.body);

      if (!result.ok) {
        return res.status(result.status).json({
          error: "Error from microservice",
          detail: result.data.detail,
        });
      }
      res.status(result.status).json(result.data);
    } catch (err) {
      next(err);
    }
  }
);

app.put(
  "/product/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await updateProduct(Number(id), data);

      if (!result.ok) {
        return res
          .status(result.status)
          .json({ data: result.data.detail, error: "Error from microservice" });
      }

      res.status(result.status).json(result.data);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  "/product/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await deleteProduct(Number(id), data);

      if (!result.ok)
        return res
          .status(result.status)
          .json({ data: result.data.detail, error: "Error from microservice" });

      res
        .status(result.status)
        .json({ message: "Product deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

app.put(
  "/product/:id/stock-decrease",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await stockDecrease(Number(id), data.discount);

      if (!result.ok)
        return res
          .status(result.status)
          .json({ data: result.data.detail, error: "Error from microservice" });

      res.status(result.status).json(result.data);
    } catch (err) {
      next(err);
    }
  }
);

app.put(
  "/product/:id/stock-increase",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await stockIncrease(Number(id), data.increase);

      if (!result.ok) {
        return res
          .status(result.status)
          .json({ data: result.data.detail, error: "Error from microservice" });
      }

      res.status(result.status).json({ data: result.data });
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/product/:id/movements",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getMovements(Number(req.params.id));

      if (!result.ok) {
        return res.status(result.status).json({
          error: "Error from microservice",
          detail: result.data.detail,
        });
      }

      res.status(result.status).json(result.data);
    } catch (err) {
      next(err);
    }
  }
);

app.listen(3000, () => {
  console.log("Listening at http://localhost:3000");
});
