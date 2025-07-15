from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
import os
import httpx
import json

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

@app.get("/api/hijri-calendar/{year}/{month}")
async def get_hijri_calendar_month(year: int, month: int):
    """Get Hijri calendar data for a specific month and year"""
    city = "Makkah"
    country = "Saudi Arabia"
    method = 4  # Umm al-Qura University

    async with httpx.AsyncClient() as client:
        url = "http://api.aladhan.com/v1/hijriCalendarByCity"
        params = {
            "city": city,
            "country": country,
            "method": method,
            "month": month,
            "year": year
        }
        try:
            resp = await client.get(url, params=params)
            data = resp.json()
            return JSONResponse(content=data)
        except Exception as e:
            return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/api/hijri-calendar-full/{year}")
async def get_full_hijri_calendar(year: int):
    """Get full Hijri calendar data for a specific year"""
    city = "Makkah"
    country = "Saudi Arabia"
    method = 4  # Umm al-Qura University

    full_year_data = {}

    async with httpx.AsyncClient() as client:
        for month in range(1, 13):
            url = "http://api.aladhan.com/v1/hijriCalendarByCity"
            params = {
                "city": city,
                "country": country,
                "method": method,
                "month": month,
                "year": year
            }
            try:
                resp = await client.get(url, params=params)
                data = resp.json()
                if data.get("code") == 200:
                    full_year_data[month] = data.get("data", [])
            except Exception as e:
                full_year_data[month] = {"error": str(e)}

    # Create a simple HTML view to display the data
    html_content = f"""
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hijri Calendar {year}</title>
        <style>
            body {{
                font-family: 'Arial', sans-serif;
                margin: 20px;
                background-color: #f5f5f5;
            }}
            h1 {{
                color: #009CDE;
                text-align: center;
            }}
            .month-container {{
                margin-bottom: 30px;
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }}
            .month-title {{
                color: #003459;
                border-bottom: 2px solid #D4A62D;
                padding-bottom: 10px;
                margin-bottom: 15px;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
            }}
            th, td {{
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
            }}
            th {{
                background-color: #009CDE;
                color: white;
            }}
            tr:nth-child(even) {{
                background-color: #f2f2f2;
            }}
            .error {{
                color: red;
                text-align: center;
                padding: 20px;
            }}
            pre {{
                white-space: pre-wrap;
                background-color: #f9f9f9;
                padding: 10px;
                border-radius: 5px;
                overflow-x: auto;
            }}
        </style>
    </head>
    <body>
        <h1>التقويم الهجري لعام {year}</h1>
    """

    # Add month data
    for month in range(1, 13):
        month_data = full_year_data.get(month, [])
        month_names = {
            1: "محرم",
            2: "صفر",
            3: "ربيع الأول",
            4: "ربيع الثاني",
            5: "جمادى الأولى",
            6: "جمادى الآخرة",
            7: "رجب",
            8: "شعبان",
            9: "رمضان",
            10: "شوال",
            11: "ذو القعدة",
            12: "ذو الحجة"
        }
        
        html_content += f"""
        <div class="month-container">
            <h2 class="month-title">{month_names.get(month, f"شهر {month}")}</h2>
        """
        
        if isinstance(month_data, list) and month_data:
            html_content += """
            <table>
                <thead>
                    <tr>
                        <th>اليوم الهجري</th>
                        <th>التاريخ الهجري</th>
                        <th>اليوم الميلادي</th>
                        <th>التاريخ الميلادي</th>
                    </tr>
                </thead>
                <tbody>
            """
            
            for day in month_data:
                try:
                    hijri_date = day.get("date", {}).get("hijri", {})
                    gregorian_date = day.get("date", {}).get("gregorian", {})
                    
                    hijri_weekday = hijri_date.get("weekday", {}).get("ar", "")
                    hijri_day = hijri_date.get("day", "")
                    hijri_month = hijri_date.get("month", {}).get("ar", "")
                    hijri_year = hijri_date.get("year", "")
                    
                    gregorian_weekday = gregorian_date.get("weekday", {}).get("ar", "")
                    gregorian_day = gregorian_date.get("day", "")
                    gregorian_month = gregorian_date.get("month", {}).get("ar", "")
                    gregorian_year = gregorian_date.get("year", "")
                    
                    html_content += f"""
                    <tr>
                        <td>{hijri_weekday}</td>
                        <td>{hijri_day} {hijri_month} {hijri_year}</td>
                        <td>{gregorian_weekday}</td>
                        <td>{gregorian_day} {gregorian_month} {gregorian_year}</td>
                    </tr>
                    """
                except Exception as e:
                    html_content += f"""
                    <tr>
                        <td colspan="4" class="error">Error processing day data: {str(e)}</td>
                    </tr>
                    """
            
            html_content += """
                </tbody>
            </table>
            """
        else:
            html_content += f"""
            <div class="error">
                <p>No data available for this month or error occurred</p>
                <pre>{json.dumps(month_data, indent=2, ensure_ascii=False) if isinstance(month_data, dict) else "No data"}</pre>
            </div>
            """
        
        html_content += "</div>"

    html_content += """
    </body>
    </html>
    """

    return HTMLResponse(content=html_content)

@app.get("/hijri-calendar-view", response_class=HTMLResponse)
async def view_hijri_calendar(request: Request):
    """Serve the hijri_calendar_view.html file"""
    return templates.TemplateResponse("hijri_calendar_view.html", {"request": request})

# Serve individual files
@app.get("/{file_path:path}")
async def read_file(file_path: str):
    """Serve any file from the directory"""
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "File not found"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
