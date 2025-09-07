from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import aiofiles
import shutil
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import io
from fastapi.responses import FileResponse


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Security setup
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-this-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Netrik Techworks API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Ensure upload directories exist
os.makedirs("uploads/projects", exist_ok=True)
os.makedirs("uploads/testimonials", exist_ok=True)
os.makedirs("uploads/invoices", exist_ok=True)

# Authentication Models
class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Contact Form Models
class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    service: str
    message: str
    is_read: bool = False
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

class ContactSubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service: str
    message: str

# Invoice/Quotation Models
class QuotationItem(BaseModel):
    description: str
    quantity: int
    unit_price: float
    total: float

class Quotation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    quote_number: str
    client_name: str
    client_email: EmailStr
    client_phone: str
    client_address: str
    items: List[QuotationItem]
    subtotal: float
    tax_rate: float = 0.06  # 6% GST in Malaysia
    tax_amount: float
    total_amount: float
    status: str = "draft"  # draft, sent, accepted, rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)
    valid_until: datetime
    notes: Optional[str] = None

class QuotationCreate(BaseModel):
    client_name: str
    client_email: EmailStr
    client_phone: str
    client_address: str
    items: List[QuotationItem]
    valid_days: int = 30
    notes: Optional[str] = None

# Project Models
class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    client: str
    category: str  # "Web Design", "Branding", "IT Support", etc.
    tags: List[str] = []
    images: List[str] = []  # URLs to uploaded images
    featured_image: Optional[str] = None
    completion_date: datetime
    is_featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectCreate(BaseModel):
    title: str
    description: str
    client: str
    category: str
    tags: List[str] = []
    completion_date: datetime
    is_featured: bool = False

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    client: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    completion_date: Optional[datetime] = None
    is_featured: Optional[bool] = None

# Enhanced Testimonial Models
class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    company: Optional[str] = None
    content: str
    rating: int = Field(ge=1, le=5)
    image: Optional[str] = None
    is_featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    name: str
    role: str
    company: Optional[str] = None
    content: str
    rating: int = Field(ge=1, le=5)
    is_featured: bool = False

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    company: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    is_featured: Optional[bool] = None

# Legacy Models (keeping for backward compatibility)
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Authentication utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception
    
    # In a real app, you'd check against a user database
    # For now, we'll use hardcoded admin credentials
    if token_data.username not in ["v", "haressh", "viro"]:
        raise credentials_exception
    return token_data.username

# PDF Generation utility
def generate_quotation_pdf(quotation: Quotation) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    
    # Get the default stylesheet
    styles = getSampleStyleSheet()
    
    # Create custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#1e293b')
    )
    
    # Build the PDF content
    content = []
    
    # Title
    content.append(Paragraph("QUOTATION", title_style))
    content.append(Spacer(1, 20))
    
    # Company header
    company_info = [
        ["Netrik Techworks", ""],
        ["Professional IT Services", ""],
        ["Malaysia", ""],
        ["Phone: +60 12-495 3622", f"Quote #: {quotation.quote_number}"],
        ["Email: info@netriktechworks.com", f"Date: {quotation.created_at.strftime('%d/%m/%Y')}"],
        ["", f"Valid Until: {quotation.valid_until.strftime('%d/%m/%Y')}"]
    ]
    
    company_table = Table(company_info, colWidths=[3*inch, 2*inch])
    company_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, 2), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    
    content.append(company_table)
    content.append(Spacer(1, 30))
    
    # Client information
    client_info = [
        ["Bill To:", ""],
        [quotation.client_name, ""],
        [quotation.client_address, ""],
        [f"Phone: {quotation.client_phone}", ""],
        [f"Email: {quotation.client_email}", ""]
    ]
    
    client_table = Table(client_info, colWidths=[3*inch, 2*inch])
    client_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    
    content.append(client_table)
    content.append(Spacer(1, 30))
    
    # Items table
    items_data = [["Description", "Qty", "Unit Price (RM)", "Total (RM)"]]
    for item in quotation.items:
        items_data.append([
            item.description,
            str(item.quantity),
            f"{item.unit_price:.2f}",
            f"{item.total:.2f}"
        ])
    
    # Add totals
    items_data.extend([
        ["", "", "Subtotal:", f"{quotation.subtotal:.2f}"],
        ["", "", f"GST ({quotation.tax_rate*100:.0f}%):", f"{quotation.tax_amount:.2f}"],
        ["", "", "Total:", f"{quotation.total_amount:.2f}"]
    ])
    
    items_table = Table(items_data, colWidths=[3*inch, 0.8*inch, 1.2*inch, 1.2*inch])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('ALIGN', (0, 1), (0, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -4), 1, colors.black),
        ('LINEBELOW', (2, -3), (-1, -1), 1, colors.black),
        ('FONTNAME', (2, -1), (-1, -1), 'Helvetica-Bold'),
        ('BACKGROUND', (2, -1), (-1, -1), colors.HexColor('#f1f5f9')),
    ]))
    
    content.append(items_table)
    
    if quotation.notes:
        content.append(Spacer(1, 30))
        content.append(Paragraph("Notes:", styles['Heading3']))
        content.append(Paragraph(quotation.notes, styles['Normal']))
    
    # Build the PDF
    doc.build(content)
    buffer.seek(0)
    return buffer


# Authentication routes
@api_router.post("/admin/login", response_model=Token)
async def admin_login(admin_login: AdminLogin):
    # Secure admin credentials with 12-character passwords
    admin_credentials = {
        "v": get_password_hash("a1b-2c3.d4e-5f6"),
        "haressh": get_password_hash("x9y-8z7.w6v-5u4"),
        "viro": get_password_hash("m3n-4o5.p6q-7r8")
    }
    
    # Check if username exists and password is correct
    if admin_login.username not in admin_credentials or not verify_password(admin_login.password, admin_credentials[admin_login.username]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    access_token = create_access_token(
        data={"sub": admin_login.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Contact Form routes
@api_router.post("/contact", response_model=ContactSubmission)
async def submit_contact_form(submission: ContactSubmissionCreate):
    contact_dict = submission.dict()
    contact_obj = ContactSubmission(**contact_dict)
    result = await db.contact_submissions.insert_one(contact_obj.dict())
    return contact_obj

@api_router.get("/admin/contact-submissions", response_model=List[ContactSubmission])
async def get_contact_submissions(current_admin: str = Depends(get_current_admin)):
    submissions = await db.contact_submissions.find().sort("submitted_at", -1).to_list(1000)
    return [ContactSubmission(**submission) for submission in submissions]

@api_router.patch("/admin/contact-submissions/{submission_id}/read")
async def mark_submission_as_read(submission_id: str, current_admin: str = Depends(get_current_admin)):
    result = await db.contact_submissions.update_one(
        {"id": submission_id},
        {"$set": {"is_read": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"message": "Submission marked as read"}

# Quotation routes
@api_router.post("/admin/quotations", response_model=Quotation)
async def create_quotation(quotation_data: QuotationCreate, current_admin: str = Depends(get_current_admin)):
    # Generate quote number
    quote_count = await db.quotations.count_documents({}) + 1
    quote_number = f"NT-{datetime.now().year}-{quote_count:04d}"
    
    # Calculate totals
    subtotal = sum(item.total for item in quotation_data.items)
    tax_amount = subtotal * 0.06  # 6% GST
    total_amount = subtotal + tax_amount
    
    # Set validity date
    valid_until = datetime.utcnow() + timedelta(days=quotation_data.valid_days)
    
    quotation_dict = quotation_data.dict()
    quotation_dict.update({
        "quote_number": quote_number,
        "subtotal": subtotal,
        "tax_amount": tax_amount,
        "total_amount": total_amount,
        "valid_until": valid_until
    })
    
    quotation_obj = Quotation(**quotation_dict)
    result = await db.quotations.insert_one(quotation_obj.dict())
    return quotation_obj

@api_router.get("/admin/quotations", response_model=List[Quotation])
async def get_quotations(current_admin: str = Depends(get_current_admin)):
    quotations = await db.quotations.find().sort("created_at", -1).to_list(1000)
    return [Quotation(**quotation) for quotation in quotations]

@api_router.get("/admin/quotations/{quotation_id}", response_model=Quotation)
async def get_quotation(quotation_id: str, current_admin: str = Depends(get_current_admin)):
    quotation = await db.quotations.find_one({"id": quotation_id})
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return Quotation(**quotation)

@api_router.get("/admin/quotations/{quotation_id}/pdf")
async def download_quotation_pdf(quotation_id: str, current_admin: str = Depends(get_current_admin)):
    quotation_data = await db.quotations.find_one({"id": quotation_id})
    if not quotation_data:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    quotation = Quotation(**quotation_data)
    pdf_buffer = generate_quotation_pdf(quotation)
    
    # Save PDF to file system
    pdf_filename = f"quotation_{quotation.quote_number}.pdf"
    pdf_path = f"uploads/invoices/{pdf_filename}"
    
    with open(pdf_path, "wb") as f:
        f.write(pdf_buffer.getvalue())
    
    return FileResponse(
        path=pdf_path,
        filename=pdf_filename,
        media_type="application/pdf"
    )

# Project routes
@api_router.post("/admin/projects", response_model=Project)
async def create_project(project_data: ProjectCreate, current_admin: str = Depends(get_current_admin)):
    project_dict = project_data.dict()
    project_obj = Project(**project_dict)
    result = await db.projects.insert_one(project_obj.dict())
    return project_obj

@api_router.get("/projects", response_model=List[Project])
async def get_projects(category: Optional[str] = None, featured_only: bool = False):
    filter_query = {}
    if category:
        filter_query["category"] = category
    if featured_only:
        filter_query["is_featured"] = True
    
    projects = await db.projects.find(filter_query).sort("completion_date", -1).to_list(1000)
    return [Project(**project) for project in projects]

@api_router.get("/admin/projects", response_model=List[Project])
async def get_admin_projects(current_admin: str = Depends(get_current_admin)):
    projects = await db.projects.find().sort("created_at", -1).to_list(1000)
    return [Project(**project) for project in projects]

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return Project(**project)

@api_router.patch("/admin/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project_update: ProjectUpdate, current_admin: str = Depends(get_current_admin)):
    update_dict = {k: v for k, v in project_update.dict().items() if v is not None}
    
    result = await db.projects.update_one(
        {"id": project_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    updated_project = await db.projects.find_one({"id": project_id})
    return Project(**updated_project)

@api_router.delete("/admin/projects/{project_id}")
async def delete_project(project_id: str, current_admin: str = Depends(get_current_admin)):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

@api_router.post("/admin/projects/{project_id}/images")
async def upload_project_image(
    project_id: str, 
    file: UploadFile = File(...), 
    current_admin: str = Depends(get_current_admin)
):
    # Check if project exists
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"uploads/projects/{unique_filename}"
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    # Update project with new image
    image_url = f"/uploads/projects/{unique_filename}"
    await db.projects.update_one(
        {"id": project_id},
        {"$push": {"images": image_url}}
    )
    
    # If it's the first image, set as featured image
    if not project.get("featured_image"):
        await db.projects.update_one(
            {"id": project_id},
            {"$set": {"featured_image": image_url}}
        )
    
    return {"image_url": image_url}

# Testimonial routes
@api_router.post("/admin/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial_data: TestimonialCreate, current_admin: str = Depends(get_current_admin)):
    testimonial_dict = testimonial_data.dict()
    testimonial_obj = Testimonial(**testimonial_dict)
    result = await db.testimonials.insert_one(testimonial_obj.dict())
    return testimonial_obj

@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials(featured_only: bool = False):
    filter_query = {}
    if featured_only:
        filter_query["is_featured"] = True
    
    testimonials = await db.testimonials.find(filter_query).sort("created_at", -1).to_list(1000)
    return [Testimonial(**testimonial) for testimonial in testimonials]

@api_router.get("/admin/testimonials", response_model=List[Testimonial])
async def get_admin_testimonials(current_admin: str = Depends(get_current_admin)):
    testimonials = await db.testimonials.find().sort("created_at", -1).to_list(1000)
    return [Testimonial(**testimonial) for testimonial in testimonials]

@api_router.patch("/admin/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(testimonial_id: str, testimonial_update: TestimonialUpdate, current_admin: str = Depends(get_current_admin)):
    update_dict = {k: v for k, v in testimonial_update.dict().items() if v is not None}
    
    result = await db.testimonials.update_one(
        {"id": testimonial_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    updated_testimonial = await db.testimonials.find_one({"id": testimonial_id})
    return Testimonial(**updated_testimonial)

@api_router.delete("/admin/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, current_admin: str = Depends(get_current_admin)):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted successfully"}

@api_router.post("/admin/testimonials/{testimonial_id}/image")
async def upload_testimonial_image(
    testimonial_id: str, 
    file: UploadFile = File(...), 
    current_admin: str = Depends(get_current_admin)
):
    # Check if testimonial exists
    testimonial = await db.testimonials.find_one({"id": testimonial_id})
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"uploads/testimonials/{unique_filename}"
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    # Update testimonial with new image
    image_url = f"/uploads/testimonials/{unique_filename}"
    await db.testimonials.update_one(
        {"id": testimonial_id},
        {"$set": {"image": image_url}}
    )
    
    return {"image_url": image_url}

# File serving route for uploaded images
@api_router.get("/uploads/{folder}/{filename}")
async def serve_uploaded_file(folder: str, filename: str):
    file_path = f"uploads/{folder}/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

# Legacy routes (keeping for backward compatibility)
@api_router.get("/")
async def root():
    return {"message": "Netrik Techworks API v1.0.0"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
