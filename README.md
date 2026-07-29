
###Functional Todo Application Architecture
An architectural implementation of a Todo Application built with Vanilla JavaScript using pure Functional Programming (FP) concepts, an immutable Store pattern, and dynamic Observer Subscriptions.

### 💡Idea & Overall Architecture
The core objective of this project is to achieve absolute Separation of Concerns (SoC) by disconnecting core business logic from DOM operations and browser persistence mechanisms.

Instead of binding data modifications directly to the DOM or mixing API/storage calls inside functions, the application is divided into three distinct operational layers:

- Storage Layer (Side Effects): Safely handles interactions with localStorage.
- Core Logic Layer (Pure Functions): Handles array manipulation, state creation, and updates immutably without any external side effects.
- Store & Bridge Layer (State Management): Acts as a central orchestrator managing state transitions and broadcasting updates via the Observer Pattern.

## Components & Applied Concepts
1. Pure Functions & Immutability
All core todo operations (addTodo, toggleTodo, deleteTodo) are written as pure functions. They do not mutate original arrays; instead, they return fresh copies using the Spread Operator (...) and Array methods like .map() and .filter().

2. High-Order Functions & Currying
Functions like safeJSONParse and saveToStorage utilize partial application and currying techniques to encapsulate configuration keys and safely execute dynamic operations.

3. Store Pattern with Closure
State encapsulation is achieved via createStore. Internal variables (state and listeners) are kept private inside a closure and can only be accessed or modified through explicit methods (getState, dispatch, subscribe).

4. Event Delegation
Instead of binding individual event listeners to every list item button, a single delegated listener attached to the parent container (ul) listens for events, reducing memory consumption and enhancing performance.

5. Observer Pattern
Subscribers (UI renderer and Storage persistence) subscribe to state changes. Whenever dispatch triggers, all listeners execute automatically in a reactive manner.
________________________________________________________________________
### Step by Step Execution Lifecycle
## Initialization:
loadFromStorage fetches raw JSON from localStorage and safely parses it using safeJSONParse.
createStore initializes with the parsed data or a fallback empty array ([]).

## Subscription Setup:
The render function subscribes to the store.
The saveToStorage function subscribes to the store.

## DOM Ready & Initial Render:
Upon DOMContentLoaded, the store’s current state is read via getState() and painted to the DOM using render.

## Action Dispatching:
User submits a todo or clicks action buttons.
Event listeners capture the interaction and call store.dispatch().
The store executes the reducer, mutates internal state immutably, and triggers all subscribers sequentially.

### Key Advantages of This Architecture
- Decoupled Architecture: Business logic is entirely decoupled from DOM/Storage layers. Replacing localStorage with a Remote REST API requires changing only the subscriber function—zero changes needed in business functions or UI logic.
- Testability: All pure logic functions can be unit-tested without mocking DOM elements or browser APIs.
- Predictable State Transitions: One-way data flow prevents race conditions and makes application behavior transparent and predictable.
- Scalability: The store structure serves as a lightweight foundation for scaling applications similarly to modern frameworks like Redux or React (useReducer).
