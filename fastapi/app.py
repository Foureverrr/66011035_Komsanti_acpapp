# app.py

from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from database import async_engine, get_db, metadata
from models import Customer, Vehicle, Main
from crud import create_customer, create_vehicle, create_main, delete_customer_by_id
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from sqlalchemy import select

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
    cost: float
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
    
# Endpoint to generate report
@app.get("/api/get_report")
async def get_report(start_date: datetime, end_date: datetime, db: AsyncSession = Depends(get_db)):
    try:
        print(f"Generating report for date range: {start_date} to {end_date}")
        
        # Fetch customer IDs within the date range from the Customer table
        customer_stmt = select(Customer.id).where(Customer.timestamp.between(start_date, end_date))
        customer_result = await db.execute(customer_stmt)
        customer_ids = [row[0] for row in customer_result.fetchall()]

        if not customer_ids:
            print("No customers found in the specified date range.")
            return {"carBrands": [], "totalIncome": 0}

        # Fetch entries from the Main table for the matched customer IDs
        stmt = select(Main).where(Main.id.in_(customer_ids))
        result = await db.execute(stmt)
        customers = result.scalars().all()

        # Debug: Print the number of customers found
        print(f"Number of customers found: {len(customers)}")

        # Calculate car brand count and percentage
        brand_count = {}
        total_customers = len(customers)

        for customer in customers:
            brand = customer.car.split()[0] if customer.car else "Unknown"
            brand_count[brand] = brand_count.get(brand, 0) + 1

        car_brands = [
            {"name": brand, "percentage": (count / total_customers) * 100, "count": count}
            for brand, count in brand_count.items()
        ]

        # Calculate total income
        total_income = sum(customer.cost for customer in customers if customer.cost)

        return {"carBrands": car_brands, "totalIncome": total_income}
    except Exception as e:
        print(f"Error generating report: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to generate report: {e}")

@app.post("/api/add_customer")
async def add_customer(customer: CustomerCreate, db: AsyncSession = Depends(get_db)):
    try:
        # Create a default timestamp if it's not provided
        if not customer.timestamp:
            customer.timestamp = datetime.utcnow()
        
        # Debug: Print received customer data
        print("Received customer data:", customer.dict())  # Debugging message to see incoming data

        # Create new entries for the customer, vehicle, and main tables
        new_customer = await create_customer(db, customer.dict())
        print(f"Created customer in DB: {new_customer}")

        new_vehicle = await create_vehicle(db, customer.dict())
        print(f"Created vehicle in DB: {new_vehicle}")

        new_main = await create_main(db, customer.dict())
        print(f"Created main entry in DB: {new_main}")

        # Debug output to ensure fields are correctly saved
        print(f"Final Main Entry - Brand: {new_main.car}, Timestamp: {new_customer.timestamp}")

        # Return success message with relevant data
        return {
            "message": "Customer data added successfully",
            "customer": {
                "id": new_customer.id,
                "customer_name": f"{customer.name} {customer.surname}",
                "tel": customer.tel,
                "license_plate": customer.licensePlate,
                "brand": customer.brand,
                "model": customer.model,
                "symptoms": customer.symptoms,
                "cost": customer.cost,
                "mechanic": customer.mechanic,
                "timestamp": new_customer.timestamp.isoformat()  # Convert timestamp to ISO format
            }
        }
    except Exception as e:
        print(f"Error adding customer data: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to add customer data: {e}")


@app.get("/api/get_customers")
async def get_customers(db: AsyncSession = Depends(get_db)):
    try:
        # Perform a join to include the timestamp from the Customer table based on `tel`
        stmt = select(
            Main.id,
            Main.customer_name,
            Main.tel,
            Main.license_plate,
            Main.car,
            Main.symptoms,
            Main.cost,
            Main.mechanic,
            Customer.timestamp  # Include the timestamp from the Customer table
        ).select_from(
            join(Main, Customer, Main.tel == Customer.tel)  # Join based on `tel` field
        )

        result = await db.execute(stmt)
        customers = result.all()

        # Convert results to a list of dictionaries including the timestamp
        customers_dict = [
            {
                "id": customer.id,
                "customer_name": customer.customer_name,
                "tel": customer.tel,
                "license_plate": customer.license_plate,
                "car": customer.car,
                "symptoms": customer.symptoms,
                "cost": customer.cost,
                "mechanic": customer.mechanic,
                "timestamp": customer.timestamp.isoformat() if customer.timestamp else None
            }
            for customer in customers
        ]

        return customers_dict
    except Exception as e:
        print(f"Error fetching customers: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to fetch customers: {e}")



@app.delete("/api/delete_customer/{customer_id}")
async def delete_customer(customer_id: int, db: AsyncSession = Depends(get_db)):
    """
    Endpoint to delete a customer and related data from the database.
    """
    try:
        await delete_customer_by_id(db, customer_id)
        return {"message": f"Customer with ID {customer_id} deleted successfully"}
    except Exception as e:
        print(f"Error deleting customer: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to delete customer: {e}")