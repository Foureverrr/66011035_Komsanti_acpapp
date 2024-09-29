# app.py

from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from database import async_engine, get_db, metadata
from models import Customer, Vehicle, Main
from crud import create_customer, create_vehicle, create_main
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

# Define a Pydantic model for incoming customer data
class CustomerCreate(BaseModel):
    name: str
    surname: str
    tel: str
    brand: str
    model: str
    licensePlate: str
    symptoms: str
    nextCheckup: float
    mechanic: str
    timestamp: datetime = None  # Include a timestamp field with a default of None

# CORS middleware configuration to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    # Explicitly create the tables if they don't exist
    async with async_engine.begin() as conn:
        print("Creating tables...")
        await conn.run_sync(metadata.create_all)
        print("Tables created successfully")

@app.on_event("shutdown")
async def shutdown():
    await async_engine.dispose()
    print("Database connection closed")

@app.post("/api/add_customer")
async def add_customer(customer: CustomerCreate, db: AsyncSession = Depends(get_db)):
    """
    Endpoint to add a new customer, vehicle, and main entry.
    """
    try:
        # If no timestamp is provided, set it to the current time
        if customer.timestamp is None:
            customer.timestamp = datetime.utcnow()  # Ensure we have a timestamp

        print("Received customer data:", customer.dict())
        
        # Create new entries for the customer, vehicle, and main tables
        new_customer = await create_customer(db, customer.dict())
        print(f"Created customer: {new_customer}")
        new_vehicle = await create_vehicle(db, customer.dict())
        print(f"Created vehicle: {new_vehicle}")
        new_main = await create_main(db, customer.dict())
        print(f"Created main entry: {new_main}")
        
        # Return success message upon successful entry
        return {"message": "Customer data added successfully"}
    except Exception as e:
        print(f"Error adding customer data: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to add customer data: {e}")

@app.get("/api/get_customers")
async def get_customers(db: AsyncSession = Depends(get_db)):
    """
    Endpoint to get all customers for frontend display.
    """
    try:
        result = await db.execute("SELECT * FROM customer")
        customers = result.fetchall()
        print(f"Fetched customers: {customers}")
        return customers
    except Exception as e:
        print(f"Error fetching customers: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to fetch customers: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
