from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
import os

# Create FastAPI app
app = FastAPI(title="Media Templates App")

# Mount static files directory
app.mount("/static", StaticFiles(directory="."), name="static")

# Set up templates
templates = Jinja2Templates(directory=".")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Serve the index.html file"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/form", response_class=HTMLResponse)
async def read_form(request: Request):
    """Serve the form.html file"""
    return templates.TemplateResponse("form.html", {"request": request})

@app.get("/loading", response_class=HTMLResponse)
async def read_loading(request: Request):
    """Serve the loading.html file"""
    return templates.TemplateResponse("loading.html", {"request": request})

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    """Serve favicon.ico"""
    return FileResponse("favicon.ico") if os.path.exists("favicon.ico") else None

# Serve individual files
@app.get("/{file_path:path}")
async def read_file(file_path: str):
    """Serve any file from the directory"""
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "File not found"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
