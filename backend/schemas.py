from pydantic import BaseModel

class ItemBase(BaseModel):
    name: str
    price: float = 0
    is_estimate: bool = False
    status: str
    supplier: str
    person: str
    bought_date: str | None = None
    delivery_window: str | None = None
    delivered_date: str | None = None
    urgent_deadline: str | None = None
    wishlist_status: str | None = None
    note: str | None = None
    progress: int | None = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: int

    model_config = {"from_attributes": True}
