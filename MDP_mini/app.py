from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def get_options(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/predict", response_class=HTMLResponse)
async def predict(request: Request, option: str = Form(...)):
    if option == "heart_disease":
        return templates.TemplateResponse("heart_disease.html", {"request": request})
    elif option == "diabetes":
        return templates.TemplateResponse("diabetes.html", {"request": request})
    elif option == "flu":
        return templates.TemplateResponse("flu.html", {"request": request})
    elif option == "cold":
        return templates.TemplateResponse("cold.html", {"request": request})
    elif option == "allergy":
        return templates.TemplateResponse("allergy.html", {"request": request})
    elif option == "covid":
        return templates.TemplateResponse("covid.html", {"request": request})
    else:
        return templates.TemplateResponse("index.html", {"request": request, "error": "Invalid option"})