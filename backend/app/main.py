from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import events, register, passport, login, projects, admin

app = FastAPI(
    title="AI Project Sprint API",
    description="Backend for the AI Project Sprint campaign",
    version="1.0.0",
)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
app.include_router(events.router, prefix="/v1/events", tags=["Events"])
app.include_router(register.router, prefix="/v1/register", tags=["Registration"])
app.include_router(passport.router, prefix="/v1/passport", tags=["Passport"])
app.include_router(login.router, prefix="/v1/login", tags=["Login"])
app.include_router(projects.router, prefix="/v1", tags=["Projects"])
app.include_router(admin.router, prefix="/v1/admin", tags=["Admin"])


@app.get("/", tags=["Health"])
async def health():
    return {"status": "ok", "service": "ai-project-sprint-api"}


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
