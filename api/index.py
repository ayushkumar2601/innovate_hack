# api/index.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import app as fastapi_app

# This is the handler Vercel will use
app = fastapi_app