# MCOMQLinks: Rotator System Update (Phase 2)

## 🎯 Overview
This update introduces the advanced **Three-Layer Exposure System**, moving beyond simple rotation to a strategic, weighted network. It ensures that 247GBS maintains central control while empowering local business owners with expansion tools.

---

## 🏗️ The 3-Layer Exposure System
The rotator now logic follows a priority hierarchy:

1.  **📍 HYPER-LOCAL (Standard)**: Tied directly to a shop’s physical postcode. Use for driving foot traffic.
2.  **🚀 NEARBY EXPANSION (Growth)**: Expansion tool for B2B outreach and cross-high-street partnerships.
3.  **🌐 NATIONAL NETWORK (Premium)**: Platform-wide fallback campaigns and corporate branding (CPM/Fixed).

---

## ✨ Key New Features

### 1. Real-Time Weighting (The "Boost" Logic) 💎
The rotator now uses a probability-based selection within layers.
*   **Example**: If Toby Barbers has a `70%` weight and Peckham Records has `30%`, Toby appears 7x for every 3x his partner appears.
*   **Sequential Memory**: The system remembers the last shown offer for each location to prevent repetitive "blind spots."

### 2. Intelligent Proximity 📍
A simulated "Nearby" API checks the distance/radius of a campaign against the hub's postcode.
*   Campaigns can now "bridge" between high streets within a specified radius (km).

### 3. "No Payment = No Visibility" Enforcement 🚫
Billing status is now integrated directly into the rotation engine.
*   **Lockout**: Any account with a `suspended` billing status is automatically removed from all rotation layers instantly.
*   **Admin Control**: Admins can now manually toggle billing suspension from the Offer Manager.

### 4. Added: Admin Rulebook (Plan Config) 🛡️
Admins have a new "Idiot-Proof" interface to set global rules for each tier:
*   **Hyper-local Limits**: Set max active campaigns for the base tier.
*   **Permission Toggles**: Switch access to "Nearby" and "National" layers on/off for specific membership levels.
*   **Max Rotation Power**: Set a global cap on how much "weight" a member can request for their campaigns.

### 5. Added: Owner Billing Portal 💳
Business owners now have a dedicated space to manage their membership:
*   **Upgrade Modal**: Integrated with the new **Hyper-local / Nearby / National** naming and pricing structure.
*   **Billing Simulation**: Owners can see if their campaigns are currently hidden due to suspension and clear balances via a mock payment gateway.

---

## 🧪 How to Test It

### A. Testing Rotation Layers
1.  **Peckham Storefront**: Visit `/r/loc-peckham-01`. You should see local Peckham offers. 
2.  **Nearby Expansion**: Check the **Toby Barbers Nearby** offer in the Admin Dashboard. It is targeting Brixton (`SW9`). Visit the Brixton storefront at `/r/loc-brixton-01` to see the expansion offer mixing in with local Brixton ads!
3.  **National Fallback**: Visit `/r/loc-stratford-01`. It will fall back to **National** corporate campaigns.

### B. Testing Real-Time Weighting (Peckham)
1.  Go to the **Admin Offer Manager**.
2.  Find the two active Peckham offers.
3.  Refresh the storefront `/r/loc-peckham-01` several times.
4.  Notice that Toby Barbers (70% weight) appears significantly more often than Peckham Records (30% weight).

### C. Testing Billing Lockout
1.  Go to the **Admin Offer Manager**.
2.  Find an active offer and click the **Lock Icon** (Suspend Billing).
3.  Refresh the storefront for that location. The offer will immediately disappear from the rotation.

### D. Testing Plan Rules (Admin)
1.  Navigate to **Admin -> Plan Configuration**.
2.  Toggle the "Access to National" switch for the **Nearby Expansion** plan.
3.  Click "Save Rules". Local businesses on that plan will instantly gain or lose access to those network features.
