from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from models import Item
from schemas import ItemCreate, ItemUpdate, ItemResponse

Base.metadata.create_all(bind=engine)

app = FastAPI()

SEED_DATA = [
    {
        "name": "Bosch Drill Set", "price": 89.99, "status": "pickup",
        "supplier": "Amazon", "person": "Cesar", "bought_date": "Jun 1",
        "urgent_deadline": "Jun 9",
        "note": "At DPD pickup point, Rīgas iela 42. Missed delivery Jun 4.",
        "progress": 80,
    },
    {
        "name": "IKEA KALLAX Shelf Unit", "price": 69.99, "status": "ordered",
        "supplier": "IKEA Online", "person": "Ieva", "bought_date": "Jun 3",
        "delivery_window": "Jun 10–12",
        "note": "Need someone home — large parcel, won't fit in mailbox",
        "progress": 55,
    },
    {
        "name": "Wireless Earbuds", "price": 34.50, "status": "ordered",
        "supplier": "Amazon", "person": "Cesar", "bought_date": "Jun 5",
        "delivery_window": "Jun 11–14", "progress": 30,
    },
    {
        "name": "Vintage Table Lamp", "price": 25.00, "status": "ordered",
        "supplier": "WhatsApp 2nd hand", "person": "Ieva", "bought_date": "Jun 6",
        "delivery_window": "Jun 8",
        "note": "Seller: Māris, meeting at Centrs at 14:00",
        "progress": 90,
    },
    {
        "name": "Robot Vacuum Cleaner", "price": 299, "is_estimate": True,
        "status": "wishlist", "supplier": "Amazon", "person": "Both",
        "wishlist_status": "Discussing",
        "note": "Cesar wants Roborock, Ieva prefers Dreame. Waiting for Prime Day deals?",
    },
    {
        "name": "Cast Iron Pan 28cm", "price": 45, "is_estimate": True,
        "status": "wishlist", "supplier": "eBay", "person": "Ieva",
        "wishlist_status": "Researching",
    },
    {
        "name": "Standing Desk Converter", "price": 180, "is_estimate": True,
        "status": "wishlist", "supplier": "Amazon", "person": "Cesar",
        "wishlist_status": "Approved",
        "note": "Budget approved, waiting for salary",
    },
    {
        "name": "Garden Hose 30m", "price": 35, "is_estimate": True,
        "status": "wishlist", "supplier": "WhatsApp 2nd hand", "person": "Both",
        "wishlist_status": "Looking",
        "note": "Checking local marketplace groups",
    },
    {
        "name": "Running Shoes Nike", "price": 28.37, "status": "delivered",
        "supplier": "eBay", "person": "Cesar", "bought_date": "May 25",
        "delivered_date": "Jun 2",
    },
    {
        "name": "Kids Book Set (x5)", "price": 0, "status": "delivered",
        "supplier": "WhatsApp 2nd hand", "person": "Ieva",
        "bought_date": "May 28", "delivered_date": "May 28",
        "note": "Free — from neighbor Līga",
    },
]


@app.on_event("startup")
def seed_database():
    db = next(get_db())
    if db.query(Item).count() == 0:
        for data in SEED_DATA:
            db.add(Item(**data))
        db.commit()
    db.close()


@app.get("/api/items", response_model=list[ItemResponse])
def list_items(db: Session = Depends(get_db)):
    return db.query(Item).all()


@app.post("/api/items", response_model=ItemResponse, status_code=201)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = Item(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@app.put("/api/items/{item_id}", response_model=ItemResponse)
def update_item(item_id: int, item: ItemUpdate, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    for key, value in item.model_dump().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item


@app.delete("/api/items/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
