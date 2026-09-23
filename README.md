# FridgePolice

FridgePolice is a small roommate food-tracking dashboard built with React, Vite, and JavaScript. It helps roommates track shared food, reserve portions, approve usage, expire approvals, correct mismatches in the fridge, and log food activity in a clean and beginner-friendly interface.

## Features

- Shared food inventory
- Portion requests
- Reservation logic
- Approval lifecycle
- Unique food item IDs
- Inventory correction
- Activity log

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- React State

## Installation

```bash
npm install
npm run dev
```

## Four Challenge Scenarios

### Scenario 1: Prevent Double Allocation
A request checks the current item quantity and reserves it in the same React state update, so two roommates cannot both receive the last portion.

### Scenario 2: Approved But Never Consumed
Approvals can be expired manually. If food is still valid, the reserved amount is returned to available inventory. If the item has been marked spoiled, the reserved amount is not restored.

### Scenario 3: Identical Food Items
Physical items are tracked by unique IDs, so `ketchup-001` and `ketchup-002` remain separate even when they share the same name.

### Scenario 4: Inventory Mismatch
The app includes a correction flow that updates the recorded quantity to match what is actually in the fridge and logs the change.

## Project Structure

```text
src/
  components/
  data/
  utils/
  App.jsx
  App.css
  main.jsx
```

## Testing

1. Open the app and review the default inventory.
2. Use the pizza item to test the double-allocation case.
3. Approve and then expire a request to test the approval lifecycle.
4. Use the ketchup items to confirm unique IDs keep them separate.
5. Update the recorded quantity on any item to test inventory correction.
6. Use Reset Demo Data to restore the original starting state.
