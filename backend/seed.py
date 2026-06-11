from database import SessionLocal, Base, engine
from models import Product, ProductPrice, Promotion, Supermarket, Suburb

Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    supermarkets_data = [
        {"id": "coles", "name": "Coles"},
        {"id": "woolworths", "name": "Woolworths"},
        {"id": "aldi", "name": "Aldi"},
        {"id": "iga", "name": "IGA"},
    ]
    
    for sm_data in supermarkets_data:
        existing = db.query(Supermarket).filter(Supermarket.id == sm_data["id"]).first()
        if not existing:
            sm = Supermarket(**sm_data)
            db.add(sm)
    
    db.commit()
    
    suburbs_data = ["Melbourne CBD", "Southbank", "Richmond", "Carlton", "Docklands"]
    
    for suburb_name in suburbs_data:
        existing = db.query(Suburb).filter(Suburb.name == suburb_name).first()
        if not existing:
            suburb = Suburb(name=suburb_name)
            db.add(suburb)
    
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_data()
