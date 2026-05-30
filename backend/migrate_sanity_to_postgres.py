import asyncio
import urllib.request
import urllib.parse
import json
import os
from app.deps import get_session_factory
from app.models import Product
from sqlalchemy import select

project_id = "san7el1k"
dataset = "production"
token = "skWRr7tgyhBmMah1sOArnmVJEhtG9k5gzEoaaWXc5nOLDBYW7bSt3ATidK0ujnPckSGG20mr7mi01BIA203hFDFKl4nnDrbTj7PfNuwfNEM2K3NfbV0VG1TG3AaHalBeSLbPzbct6vfM9QmMKmr4Yooc3LKexZX8236C99giCtPTI5QPSDVU"

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "static", "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_sanity_image_url(image_ref):
    if not image_ref or "asset" not in image_ref or "_ref" not in image_ref["asset"]:
        return None
    ref = image_ref["asset"]["_ref"]
    parts = ref.split("-")
    if len(parts) < 4:
        return None
    asset_id = parts[1]
    dimensions = parts[2]
    ext = parts[3]
    url = f"https://cdn.sanity.io/images/{project_id}/{dataset}/{asset_id}-{dimensions}.{ext}"
    filename = f"{asset_id}.{ext}"
    return url, filename

def download_image(url, filename):
    filepath = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(filepath):
        return f"/static/uploads/{filename}"
    try:
        req = urllib.request.Request(
            url, 
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        )
        with urllib.request.urlopen(req) as response:
            with open(filepath, "wb") as f:
                f.write(response.read())
        print(f"Downloaded image: {filename}")
        return f"/static/uploads/{filename}"
    except Exception as e:
        print(f"Failed to download image {url}: {e}")
        return None

async def migrate():
    print("Fetching products from Sanity CMS...")
    query = '*[_type == "product"]'
    encoded_query = urllib.parse.quote(query)
    url = f"https://{project_id}.api.sanity.io/v2021-10-21/data/query/{dataset}?query={encoded_query}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            sanity_products = res_data.get("result", [])
    except Exception as e:
        print(f"Failed to query Sanity: {e}")
        return

    print(f"Found {len(sanity_products)} products in Sanity. Starting migration...")
    
    session_factory = get_session_factory()
    async with session_factory() as session:
        for idx, p in enumerate(sanity_products):
            title = p.get("title", "Untitled Product")
            slug = p.get("slug", {}).get("current")
            if not slug:
                slug = title.lower().replace(" ", "-").replace("/", "-")
                
            description = p.get("description", "")
            price = float(p.get("price", 0.0))
            discount = float(p.get("discountPercentage", 0.0))
            rating = float(p.get("rating", 5.0))
            stock = int(p.get("stock", 0))
            brand = p.get("brand", "")
            category = p.get("category", "")
            
            # Download main image
            main_image_ref = p.get("mainImage")
            main_image_url = "/placeholder.png"
            if main_image_ref:
                img_info = get_sanity_image_url(main_image_ref)
                if img_info:
                    cdn_url, filename = img_info
                    local_path = download_image(cdn_url, filename)
                    if local_path:
                        main_image_url = local_path
                        
            # Download gallery images
            gallery_refs = p.get("gallery", [])
            gallery = []
            if gallery_refs:
                for ref_item in gallery_refs:
                    img_info = get_sanity_image_url(ref_item)
                    if img_info:
                        cdn_url, filename = img_info
                        local_path = download_image(cdn_url, filename)
                        if local_path:
                            gallery.append(local_path)
            
            # Check if product already exists in postgres
            existing_prod_result = await session.execute(select(Product).where(Product.slug == slug))
            existing_prod = existing_prod_result.scalar_one_or_none()
            
            if existing_prod:
                # Update product
                existing_prod.title = title
                existing_prod.description = description
                existing_prod.price = price
                existing_prod.discount_percentage = discount
                existing_prod.rating = rating
                existing_prod.stock = stock
                existing_prod.brand = brand
                existing_prod.category = category
                existing_prod.main_image_url = main_image_url
                existing_prod.gallery = gallery
                print(f"[{idx+1}/{len(sanity_products)}] Updated product: {title}")
            else:
                # Create product
                new_prod = Product(
                    title=title,
                    slug=slug,
                    description=description,
                    price=price,
                    discount_percentage=discount,
                    rating=rating,
                    stock=stock,
                    brand=brand,
                    category=category,
                    main_image_url=main_image_url,
                    gallery=gallery
                )
                session.add(new_prod)
                print(f"[{idx+1}/{len(sanity_products)}] Inserted product: {title}")
                
        await session.commit()
    print("Migration finished successfully!")

if __name__ == "__main__":
    asyncio.run(migrate())
