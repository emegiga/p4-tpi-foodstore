from sqlmodel import Session

from app.core.database import session_factory


class UnitOfWork:
    session: Session

    def __enter__(self):
        self.session = session_factory()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is None:
                self.session.commit()  # el único commit de la aplicación
            else:
                self.session.rollback()
        finally:
            self.session.close()