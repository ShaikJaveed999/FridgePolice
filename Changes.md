# Changes

## What the application does

FridgePolice is a simple roommate food-tracking app. It allows users to view the shared inventory, request available food portions, approve requests, consume approved portions, expire approvals, mark food spoiled, fix inventory mismatches, and review recent activity.

## Scenario 1 implementation

Scenario 1 focuses on preventing double allocation. The pizza item starts with 25% available. The app validates the current item quantity and reserves the portion inside the same React state update. This prevents two roommates from both reading the old value and both receiving the same final portion.

If a request would exceed the remaining amount, the app rejects it and shows a clear error message. The request flow uses functional state updates so the available quantity stays consistent.

## Scenario 2 implementation

Scenario 2 covers the approval lifecycle. A request starts as REQUESTED and can be approved. Once approved, it is treated as reserved. The user can consume it, expire it, or mark the item spoiled. If an approval expires while the food is still fine, the reserved quantity is returned to the item. If the food is spoiled, the reservation is not restored.

The status values in the app follow the flow `REQUESTED`, `APPROVED`, `CONSUMED`, `EXPIRED`, `SPOILED`, and `CANCELLED` so the reviewer can follow the logic visually.

## Scenario 3 implementation

Scenario 3 is handled by giving each physical food item a unique ID such as `ketchup-001` and `ketchup-002`. The app never identifies items by name alone. Actions use the item ID for requests, consumption, correction, and spoilage, which ensures that consuming one ketchup bottle does not affect the other.

## Scenario 4 implementation

Scenario 4 introduces inventory correction. The app lets the user enter the actual quantity for a given item and then updates it by unique ID. After the update, the app logs the record change and updates the item quantity in the UI.

## Engineering decisions

The app keeps the product logic simple and easy to understand. It uses local React state rather than a database or external API, which is appropriate for this challenge since the goal is to model the scenarios correctly rather than build production infrastructure.

## State management approach

The app keeps separate state for `items`, `requests`, and `activities`. The inventory state tracks item quantity and status, requests track roommate actions and approval lifecycle, and activities record user-visible history. This separation makes the logic easier to reason about and explains transitions clearly.

## Why unique IDs are used

Duplicate item names are a real challenge in physical fridges. A bottle of ketchup and another bottle of ketchup are not the same object. By tracking each item by unique ID, the app can safely update and report the correct item without accidental collisions between same-named products.

## How reservations prevent double allocation

When a request is submitted, the app reads the current quantity as part of a single state update and compares it to the requested amount before writing the updated item data. If there isn’t enough quantity, the request fails immediately. This ensures the app never allows two requests to receive the same last portion.

## How approval expiration works

An approved request can be expired manually from the approval list. When it expires, the app checks whether the item is still valid and, if so, returns the reserved amount to the available inventory. The request status changes to `EXPIRED` and the item quantity goes back up. If the item has been spoiled, the amount is not restored.

## How spoiled food is handled

Spoiled food cannot be requested or consumed. Marking an item spoiled sets its status and blocks new requests. Any approved reservation tied to that item is invalid and cannot be consumed. This matches real fridge logic and prevents accidental use of damaged food.

## How inventory correction works

Each inventory card includes a correction input. The user enters the actual quantity and submits it. The app validates the number and updates the matching item by ID. The activity log then records the correction in the form `Inventory corrected: Pizza 75% → 0%`.

## Assumptions

- This is a front-end-only demo, not a production inventory system.
- Roommate names are simplified to A, B, C, and D for demonstration.
- Expiration is manual rather than time-based because the challenge does not require a live timer.
- Units are stored as simple strings like `%` and `bottle`.

## Testing performed

The implementation was reviewed against the four required scenarios. The logic was designed to support the following flows:

1. Single-item double-allocation prevention.
2. Approved approval expiration and restoration of inventory.
3. Identical-item distinction by unique ID.
4. Inventory correction by item ID with log output.
