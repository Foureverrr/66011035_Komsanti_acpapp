# crud.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from models import Customer, Vehicle, Main
from datetime import datetime

# Create a customer entry in the database
async def create_customer(db: AsyncSession, data: dict):
    try:
        print(f"Creating customer with data: {data}")
        new_customer = Customer(
            name=data['name'],
            surname=data['surname'],
            tel=data['tel'],
            timestamp=data.get('timestamp', datetime.utcnow())  # Use the provided timestamp or current UTC time
        )
        db.add(new_customer)
        await db.commit()
        await db.refresh(new_customer)
        print(f"Customer created successfully: {new_customer}")
        return new_customer
    except Exception as e:
        print(f"Error in create_customer: {e}")
        raise

# Create a vehicle entry in the database
async def create_vehicle(db: AsyncSession, data: dict):
    try:
        print(f"Creating vehicle with data: {data}")
        new_vehicle = Vehicle(
            brand=data['brand'],
            model=data['model'],
            symptoms=data['symptoms']
        )
        db.add(new_vehicle)
        await db.commit()
        await db.refresh(new_vehicle)
        print(f"Vehicle created successfully: {new_vehicle}")
        return new_vehicle
    except Exception as e:
        print(f"Error in create_vehicle: {e}")
        raise

# Create a main entry in the database
async def create_main(db: AsyncSession, data: dict):
    try:
        print(f"Creating main entry with data: {data}")
        new_main = Main(
            customer_name=f"{data['name']} {data['surname']}",
            tel=data["tel"],
            license_plate=data["licensePlate"],
            car=f"{data['brand']} {data['model']}",
            symptoms=data["symptoms"],
            cost=data["cost"],
            mechanic=data["mechanic"]
        )
        db.add(new_main)
        await db.commit()
        await db.refresh(new_main)
        print(f"Main entry created successfully: {new_main}")
        return new_main
    except Exception as e:
        print(f"Error in create_main: {e}")
        raise

# Function to delete a customer and related data from the database
async def delete_customer_by_id(db: AsyncSession, customer_id: int):
    try:
        # Delete from Main, Vehicle, and Customer tables
        await db.execute(delete(Main).where(Main.id == customer_id))
        await db.execute(delete(Vehicle).where(Vehicle.id == customer_id))
        await db.execute(delete(Customer).where(Customer.id == customer_id))
        await db.commit()
        print(f"Deleted customer with ID {customer_id}")
    except Exception as e:
        print(f"Error in delete_customer_by_id: {e}")
        raise
