# models.py

from sqlalchemy import Column, Integer, String, Float, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

# Customer Table Definition
class Customer(Base):
    __tablename__ = 'customer'
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())  # Default to current time
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    tel = Column(String(20), nullable=False)

# Vehicle Table Definition
class Vehicle(Base):
    __tablename__ = 'vehicle'
    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    symptoms = Column(String(255))

# Main Table Definition
class Main(Base):
    __tablename__ = 'main'
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(200), nullable=False)
    tel = Column(String(20), nullable=False)
    license_plate = Column(String(50), nullable=False)
    car = Column(String(200), nullable=False)
    symptoms = Column(String(255))
    cost = Column(Float)
    mechanic = Column(String(100))

class Mechanics(Base):
    __tablename__ = 'mechanics'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    tel = Column(String(20), nullable=False)
