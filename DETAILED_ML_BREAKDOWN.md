Your `recommendationService.js` uses a hybrid event recommendation algorithm. Here’s an easy, step-by-step explanation of how it works, along with a concrete example and the calculations involved:

---

## **How the Algorithm Works (Overview)**

1. **Fetch all upcoming events** (that the user hasn’t already registered for).
2. **For each event**, calculate four scores for the user:
   - **Content Score**: Does this event match the categories the user likes?
   - **Collaborative Score**: Are other similar users registering for this event?
   - **Popularity Score**: Is the event trending/near full/happening soon?
   - **Club Affinity Score**: Is the event hosted by a club the user belongs to?
3. **Combine these scores** with specific weights to get a total recommendation score for each event.
4. **Sort events by their total score** and return the top recommendations.

---

## **Calculation Breakdown with Example**

Let’s say we have:

- **User**: Alice
- **Event**: "AI Workshop" (Category: Tech, hosted by Tech Club)

### 1. **Content Score (30%)**
- Looks at Alice’s registration history.
- If Alice attended 7 events: 5 Tech, 2 Music.
  - Her Tech preference = 5/7 ≈ 0.71
- If she recently attended 1 Tech event, recencyBoost = 0.1
- **Content Score** = (Tech preference + recencyBoost) = 0.71 + 0.1 = 0.81 (max 1.0)

### 2. **Collaborative Score (30%)**
- Finds other users with similar history to Alice (users who attended the same events).
- Let’s say 10 similar users are found.
- If 4 of them have registered for "AI Workshop":
  - **Collaborative Score** = 4 / min(10, 10) = 4 / 10 = 0.4

### 3. **Popularity Score (20%)**
- Suppose "AI Workshop" has 40 attendees, max 50 allowed.
  - Base popularity = 40/50 = 0.8
- If created within the last 7 days, add 0.2: 0.8 + 0.2 = 1.0 (max is 1.0)
- If the event is happening in the next 7 days, add 0.15: But the final score is capped at 1.0

### 4. **Club Affinity Score (20%)**
- If Alice is in Tech Club (event host), score = 1.0
- If she’s in a related club, score = 0.4
- If not in any club, score = 0.3

---

### **Total Recommendation Score Calculation**

\[
\text{Total Score} = (\text{Content Score} \times 0.3) + (\text{Collaborative Score} \times 0.3) + (\text{Popularity Score} \times 0.2) + (\text{Club Affinity Score} \times 0.2)
\]

Plug in the example values:
- Content Score = 0.81
- Collaborative Score = 0.4
- Popularity Score = 1.0
- Club Affinity Score = 1.0

\[
\text{Total Score} = (0.81 \times 0.3) + (0.4 \times 0.3) + (1.0 \times 0.2) + (1.0 \times 0.2)
\]
\[
= 0.243 + 0.12 + 0.2 + 0.2 = 0.763
\]

---

## **Summary Table**

| Score Type         | Example Value | Weight | Contribution |
|--------------------|--------------|--------|--------------|
| Content            | 0.81         | 0.3    | 0.243        |
| Collaborative      | 0.4          | 0.3    | 0.12         |
| Popularity         | 1.0          | 0.2    | 0.2          |
| Club Affinity      | 1.0          | 0.2    | 0.2          |
| **Total**          | —            | 1.0    | **0.763**    |

---

## **In Short**

- Each event gets these four scores for each user.
- The scores are combined using the weights (30%, 30%, 20%, 20%).
- Events with the highest total scores are recommended to the user!

If you want a breakdown of how any specific function works (like `calculateRecencyBoost` or `calculateCollaborativeScore`), let me know!