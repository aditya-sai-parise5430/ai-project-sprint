"""
Admin endpoints — all protected by X-Admin-Key header.
"""
from fastapi import APIRouter, Depends
from app.core.database import get_db
from app.core.security import verify_admin

router = APIRouter(dependencies=[Depends(verify_admin)])


@router.get("/stats")
async def admin_stats():
    db = get_db()

    total_res = db.table("users").select("id", count="exact").execute()
    total = total_res.count or 0

    referral_res = db.table("users").select("id", count="exact").not_.is_("referred_by", "null").execute()
    referral_count = referral_res.count or 0

    return {
        "total_registrations": total,
        "referral_registrations": referral_count,
        "organic_registrations": total - referral_count,
    }


@router.get("/registrations-by-day")
async def registrations_by_day():
    db = get_db()
    result = db.table("users").select("created_at").order("created_at").execute()

    from collections import Counter
    from datetime import datetime

    counts: Counter = Counter()
    for row in result.data or []:
        day = row["created_at"][:10]  # YYYY-MM-DD
        counts[day] += 1

    return {"data": [{"date": d, "count": c} for d, c in sorted(counts.items())]}


@router.get("/source-breakdown")
async def source_breakdown():
    db = get_db()
    result = db.table("users").select("source").execute()

    from collections import Counter
    counts: Counter = Counter()
    for row in result.data or []:
        counts[row.get("source", "organic")] += 1

    return {"data": [{"source": s, "count": c} for s, c in counts.most_common()]}


@router.get("/top-referrers")
async def top_referrers(limit: int = 10):
    db = get_db()

    # Get referral counts per referrer_code
    ref_result = db.table("referrals").select("referrer_code").execute()
    from collections import Counter
    counts: Counter = Counter()
    for row in ref_result.data or []:
        counts[row["referrer_code"]] += 1

    top = counts.most_common(limit)
    if not top:
        return {"data": []}

    # Enrich with names
    codes = [t[0] for t in top]
    users_result = db.table("users").select("name", "referral_code").in_("referral_code", codes).execute()
    name_map = {u["referral_code"]: u["name"] for u in (users_result.data or [])}

    return {
        "data": [
            {"referral_code": code, "name": name_map.get(code, "Unknown"), "count": count}
            for code, count in top
        ]
    }


@router.get("/funnel")
async def funnel_metrics():
    db = get_db()
    funnel_steps = [
        "landing_view",
        "readiness_check_started",
        "readiness_check_completed",
        "registration_started",
        "registration_completed",
        "referral_link_viewed",
        "share_clicked",
    ]

    result = db.table("events").select("event_name", count="exact").in_("event_name", funnel_steps).execute()

    # Count per event_name
    from collections import Counter
    step_counts: dict = {}
    for step in funnel_steps:
        res = db.table("events").select("id", count="exact").eq("event_name", step).execute()
        step_counts[step] = res.count or 0

    data = []
    for i, step in enumerate(funnel_steps):
        count = step_counts[step]
        prev = step_counts[funnel_steps[i - 1]] if i > 0 else count
        drop_pct = round((1 - count / prev) * 100, 1) if prev > 0 and i > 0 else 0.0
        data.append({"step": step, "count": count, "drop_off_pct": drop_pct})

    return {"data": data}
