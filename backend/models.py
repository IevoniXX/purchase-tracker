from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False, default=0)
    is_estimate = Column(Boolean, default=False)
    status = Column(String, nullable=False)
    supplier = Column(String, nullable=False)
    person = Column(String, nullable=False)
    bought_date = Column(String, nullable=True)
    delivery_window = Column(String, nullable=True)
    delivered_date = Column(String, nullable=True)
    urgent_deadline = Column(String, nullable=True)
    wishlist_status = Column(String, nullable=True)
    note = Column(String, nullable=True)
    progress = Column(Integer, nullable=True)
