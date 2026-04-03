def generate_phones():
    # Officially Released Phones (allPhonesData)
    all_phones_data = [
        {"name": "iPhone 13", "brand": "Apple", "processor": "A15 Bionic", "ram": "4GB", "storage": "128GB", "battery": "3227mAh", "display": "6.1 OLED", "camera": "12MP+12MP", "price": 42999, "status": "Released", "image": "https://dummyimage.com/400x400/000/fff&text=iPhone+13"},
        {"name": "Galaxy S24 Ultra", "brand": "Samsung", "processor": "Snapdragon 8 Gen 3", "ram": "12GB", "storage": "256GB", "battery": "5000mAh", "display": "6.8 Dynamic AMOLED", "camera": "200MP Quad", "price": 109999, "status": "Released", "image": "https://dummyimage.com/400x400/000/fff&text=S24+Ultra"},
        {"name": "iPhone 17 Pro Max", "brand": "Apple", "processor": "A19 Pro", "ram": "12GB", "storage": "256GB", "battery": "4832mAh", "display": "6.9 LTPO OLED", "camera": "48MP+48MP+48MP", "price": 169900, "status": "Released", "image": "https://dummyimage.com/400x400/000/fff&text=iPhone+17+PM"},
        {"name": "Galaxy S26 Ultra", "brand": "Samsung", "processor": "Snapdragon 8 Elite Gen 5", "ram": "16GB", "storage": "512GB", "battery": "5000mAh", "display": "6.9 Dynamic AMOLED 2X", "camera": "200MP Quad", "price": 139999, "status": "Released", "image": "https://dummyimage.com/400x400/000/fff&text=S26+Ultra"},
        {"name": "Xiaomi 17 Ultra", "brand": "Xiaomi", "processor": "Snapdragon 8 Elite Gen 5", "ram": "16GB", "storage": "512GB", "battery": "6000mAh", "display": "6.9 OLED 144Hz", "camera": "50MP Leica Quad", "price": 99999, "status": "Released", "image": "https://dummyimage.com/400x400/000/fff&text=Xiaomi+17+Ultra"},
        {"name": "Galaxy Z Fold 8", "brand": "Samsung", "processor": "Snapdragon 8 Elite Gen 5", "ram": "16GB", "storage": "512GB", "battery": "4600mAh", "display": "8.1 Foldable pOLED", "camera": "200MP Triple", "price": 199999, "status": "Released", "image": "https://dummyimage.com/400x400/000/fff&text=Z+Fold+8"},
        {"name": "Pixel 10 Pro XL", "brand": "Google", "processor": "Tensor G5", "ram": "16GB", "storage": "256GB", "battery": "5200mAh", "display": "6.8 LTPO OLED", "camera": "50MP Triple", "price": 119999, "status": "Released", "image": "https://dummyimage.com/400x400/000/fff&text=Pixel+10+Pro+XL"},
        {"name": "OnePlus 14 Pro", "brand": "OnePlus", "processor": "Snapdragon 8 Elite Gen 5", "ram": "12GB", "storage": "256GB", "battery": "6500mAh", "display": "6.82 AMOLED", "camera": "50MP Triple", "price": 79999, "status": "Released", "image": "https://dummyimage.com/400x400/000/fff&text=OnePlus+14+Pro"}
    ]

    # Upcoming/Rumored Phones (upcomingPhonesData)
    upcoming_phones_data = [
        {
            "name": "iPhone 18 Pro", "brand": "Apple",
            "processor": "A20 Pro (2nm TSMC)", "ram": "12GB", "storage": "256GB",
            "battery": "5100mAh", "display": "6.3 OLED (Under-display FaceID)", "camera": "50MP Triple (Variable Aperture)",
            "price": 139900, "status": "Rumored", "launch": "Sept 2026", "image": "https://dummyimage.com/400x400/000/fff&text=iPhone+18+Pro"
        },
        {
            "name": "iPhone 18 Ultra", "brand": "Apple",
            "processor": "A20 Pro (2nm)", "ram": "16GB", "storage": "512GB",
            "battery": "5300mAh", "display": "6.9 ProMotion 2.0", "camera": "100MP Quad",
            "price": 179900, "status": "Leaked", "launch": "Sept 2026", "image": "https://dummyimage.com/400x400/000/fff&text=iPhone+18+Ultra"
        },
        {
            "name": "Pixel 11 Pro", "brand": "Google",
            "processor": "Tensor G6 (2nm)", "ram": "16GB", "storage": "256GB",
            "battery": "5000mAh", "display": "6.3 LTPO OLED (Under-display IR)", "camera": "50MP AI Vision Gen 2",
            "price": 109999, "status": "Development", "launch": "Oct 2026", "image": "https://dummyimage.com/400x400/000/fff&text=Pixel+11+Pro"
        },
        {
            "name": "OnePlus 15 Pro", "brand": "OnePlus",
            "processor": "Snapdragon 8 Elite Gen 6", "ram": "16GB", "storage": "512GB",
            "battery": "7300mAh Dual-Cell", "display": "6.85 AMOLED 144Hz", "camera": "50MP Sony LYT-900",
            "price": 84999, "status": "Rumored", "launch": "Jan 2027", "image": "https://dummyimage.com/400x400/000/fff&text=OnePlus+15+Pro"
        },
        {
            "name": "Galaxy S27 Ultra", "brand": "Samsung",
            "processor": "Snapdragon 8 Elite Gen 6", "ram": "16GB", "storage": "512GB",
            "battery": "5500mAh", "display": "6.9 Dynamic AMOLED 3X", "camera": "440MP AI Main Sensor",
            "price": 149999, "status": "Concept", "launch": "Feb 2027", "image": "https://dummyimage.com/400x400/000/fff&text=S27+Ultra"
        },
        {
            "name": "Galaxy Z Fold 9", "brand": "Samsung",
            "processor": "Snapdragon 8 Elite Gen 6", "ram": "18GB", "storage": "1TB",
            "battery": "4800mAh", "display": "8.2 Foldable (No Crease Tech)", "camera": "200MP Triple",
            "price": 194999, "status": "Rumored", "launch": "Aug 2027", "image": "https://dummyimage.com/400x400/000/fff&text=Z+Fold+9"
        },
        {
            "name": "Xiaomi 18 Ultra", "brand": "Xiaomi",
            "processor": "Snapdragon 8 Elite Gen 6", "ram": "24GB", "storage": "1TB",
            "battery": "6500mAh", "display": "6.9 OLED 165Hz", "camera": "1-inch LOFIC Gen 2",
            "price": 104999, "status": "Rumored", "launch": "Feb 2027", "image": "https://dummyimage.com/400x400/000/fff&text=Xiaomi+18+Ultra"
        },
        {
            "name": "iPhone Fold", "brand": "Apple",
            "processor": "A20 Pro", "ram": "16GB", "storage": "512GB",
            "battery": "4600mAh", "display": "7.8 Foldable Retina", "camera": "48MP Triple",
            "price": 199990, "status": "Teased", "launch": "Late 2026", "image": "https://dummyimage.com/400x400/000/fff&text=iPhone+Fold"
        }
    ]

    return all_phones_data + upcoming_phones_data
