from typing import List, Dict, Any

def apply_farming_constraints(
    evaluated_crops: List[Dict[str, Any]],
    water_availability: str,
    budget_limit: str
) -> List[Dict[str, Any]]:
    """
    Applies agronomic penalty functions and re-weights crop scores based on farmer resource limits.
    """
    adjusted = []
    
    for item in evaluated_crops:
        crop = dict(item)
        score = crop["rawScore"]
        notes = []
        
        # 1. Water Constraint Guardrail
        water_req = crop.get("waterNeed", "Moderate")
        if water_availability == "Low":
            if water_req == "High":
                score -= 18.0
                notes.append("Demoted -18% due to high irrigation requirement under low water availability")
            elif water_req == "Moderate":
                score -= 5.0
                notes.append("Calibrated -5% for moderate water need")
            else:
                score += 8.0
                notes.append("Boosted +8% for superior drought endurance")
        elif water_availability == "High":
            if water_req == "High":
                score += 6.0
                notes.append("Boosted +6% capitalizing on abundant water reserve")
                
        # 2. Budget Constraint Guardrail
        budget_req = crop.get("budgetNeed", "Moderate")
        if budget_limit == "Low":
            if budget_req == "High":
                score -= 16.0
                notes.append("Penalized -16% due to high upfront seedling & fertilizer capital")
            elif budget_req == "Low":
                score += 7.0
                notes.append("Favored +7% for low operational capital requirement")
        elif budget_limit == "High":
            if budget_req == "High":
                score += 5.0
                notes.append("Prioritized +5% for high commercial profitability yield")
                
        # Clamp score between 5.0 and 99.3
        final_score = min(99.3, max(5.0, round(score, 1)))
        crop["score"] = final_score
        crop["adjustmentReason"] = " • ".join(notes) if notes else "Optimal match under selected resource settings"
        
        # Update badge
        if crop["score"] >= 88.0:
            crop["badge"] = "Optimal Fit"
        elif crop["score"] >= 78.0:
            crop["badge"] = "High Suitability"
        elif crop["score"] < crop["rawScore"] - 10:
            crop["badge"] = "Constraint Penalized"
        else:
            crop["badge"] = "Adjusted"
            
        adjusted.append(crop)
        
    adjusted.sort(key=lambda x: x["score"], reverse=True)
    for idx, item in enumerate(adjusted):
        item["rank"] = idx + 1
        
    return adjusted
