"""
Deterministic project matcher.

Scoring:
  +3  — project.ai_domains intersects user.ai_interest
  +2  — user.goal in project.suitable_goals
  +1  — Final-year student → beginner project (fast wins for placement)
  +1  — 3rd/Final-year student → intermediate project

Returns the highest-scoring project id.
Ties are broken by the order in PROJECTS list.
"""
from app.data.projects import PROJECTS


def match_project(ai_interest: str, goal: str, year: str) -> str:
    best_id = PROJECTS[0]["id"]
    best_score = -1

    for project in PROJECTS:
        score = 0

        if ai_interest in project["ai_domains"]:
            score += 3

        if goal in project["suitable_goals"]:
            score += 2

        if year == "Final" and project["difficulty"] == "beginner":
            score += 1

        if year in ("3rd", "Final") and project["difficulty"] == "intermediate":
            score += 1

        if score > best_score:
            best_score = score
            best_id = project["id"]

    return best_id
