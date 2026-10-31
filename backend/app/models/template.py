from sqlalchemy import Column, String, Text
from app.database import Base


class Template(Base):
    __tablename__ = "templates"

    id = Column(String(50), primary_key=True)  # corporate, modern, minimal
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="Business")
    thumbnail = Column(String(255), nullable=True)
    primary_color = Column(String(20), default="#0f2942")
    accent_color = Column(String(20), default="#2563eb")
