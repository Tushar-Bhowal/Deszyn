from fastapi import FastAPI

from deszyn_ai.env import env

app = FastAPI(title="deszyn AI", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "env": env.APP_ENV}
