from pydantic import EmailStr
from sqlmodel import Field, SQLModel


class UserCreate(SQLModel):
    username: str = Field(min_length=3, max_length=50)
    full_name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)  # bcrypt usa hasta 72 bytes