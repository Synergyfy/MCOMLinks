# MCOMQLinks: Understanding Rotator Weighting

## ⚖️ What is Rotator Weight?
"Weight" is the **Share of Voice** an offer has within its specific exposure layer (**Hyper-local**, **Nearby**, or **National**).

Instead of a simple "Next in line" rotation where everyone gets 1 scan, we use **Weighted Probability**. This allows premium subscribers to "Boost" their presence, making their ads show up more often than their competitors in the same area.

---

## 🧮 How It Works (The Math)
The rotator calculates the **Total Active Weight** for a specific location and layer. Every scan then performs a "Roll of the Dice."

### The Formula:
`Probability (%) = (Offer Weight / Total Layer Weight) * 100`

### Real-World Example (Peckham Storefront):
Imagine there are 2 active offers in the **Hyper-local** layer for Peckham:

1.  **Toby Barbers**: Weight `70`
2.  **Peckham Records**: Weight `30`
3.  **TOTAL WEIGHT**: `100`

**Result**:
*   Toby will appear **70%** of the time (approx. 7 out of every 10 scans).
*   Peckham Records will appear **30%** of the time (approx. 3 out of every 10 scans).

---

## 🏆 Tiered Maximums (The Rulebook)
We use weighting to drive revenue via membership tiers. Use the **Admin Plan Config** to enforce these limits:

*   **🟢 Hyper-local (Base)**: Max Weight Limit = `50`. (Equal share with global fallback).
*   **🟡 Nearby Expansion**: Max Weight Limit = `80`. (Dominates the local rotation).
*   **🔵 National Network**: Max Weight Limit = `100`. (Absolute priority for fixed slots).

---

## 🧩 Weighting vs. Layers
Weighting does **NOT** compete across layers. The system always follows the **Priority Hierarchy**:

1.  **HYPER-LOCAL LAYER**: If any active offers exist here, the rotator ONLY looks at these. Weighting is calculated between them.
2.  **NEARBY LAYER**: Only if NO hyper-local offers are active. Weighting is calculated between expansion ads.
3.  **NATIONAL LAYER**: The global fallback. Weighting is calculated between corporate ads.

---

## 🚀 The "Boost" Scenario
If a business owner wants to "Boost" their campaign for the weekend:
1.  Admin increases their **Rotator Weight** to `90`.
2.  Competitors in the same postcode are at `10`.
3.  **Result**: The user will see the Boosted ad almost exclusively, while the competitor only shows up once in a while.

---

## 🧪 Testing the Weighting
To see this in action:
1.  Visit the **Admin Offer Manager**.
2.  Locate two offers in the same layer (e.g. Peckham).
3.  Set one to `90` and the other to `10`.
4.  Open the Peckham storefront `/r/loc-peckham-01`.
5.  Refresh 10 times. You will see the `90` weight offer significantly more often.


remove rotator, admin offer date time needed, 
Limit for hyperlocal campaigns, reminder phone number, separate business name from full name on the sign up page, EYE ICON FOR PASSWORD FIELD, IN THE SIGNUP WE STILL HAVE MCOMLINKS INSEAD OF MCOMQLINKS


AFTER CREATING ACCOUNT IT OPENS THE SUBSCRIPTION PAGE, IT SHOULD OPEN THE CHOOSE UR PLAN MODAL


WHEN THEY CREATE OFFER , IT HAS TO BE APPROVED BY ADMIN FIRST, THEN IT WILL BE ACTIVE IN THE ROTATOR

WHEN BUSINESS WANTS 