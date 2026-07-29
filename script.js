// ==========================================
// 1. LocalStorage
// ==========================================
const safeJSONParse = (defaultVal) => (str) => {
    try {
        return str ? JSON.parse(str) : defaultVal;
    } catch {
        return defaultVal;
    }
};

const loadFromStorage = (key, defaultValue = []) => {
    const rawData = localStorage.getItem(key);
    return safeJSONParse(defaultValue)(rawData);
};

const saveToStorage = (key) => (data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Storage Error:', error);
        return data;
    }
};

// ==========================================
// 2. Todo Logic (Pure Functions)
// ==========================================
const createTodo = (text) => ({
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
});

const addTodo = (todos, text) => {
    if (!text || !text.trim()) return todos;
    return [...todos, createTodo(text)];
};

const toggleTodo = (todos, id) =>
    todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

const deleteTodo = (todos, id) =>
    todos.filter(todo => todo.id !== id);

// ==========================================
// 3. UI & Side Effects
// ==========================================
const renderTodoItem = (todo) => `
  <li data-id="${todo.id}" class="${todo.completed ? 'completed' : ''}">
    <span>${todo.text}</span>
    <button class='checkBtn' type="button" data-action="toggle">✔</button>
    <button type="button" class='DelkBtn' data-action="delete">✖</button>
  </li>
`;

const render = (todos) => {
    const listEl = document.getElementById('todo-list');
    if (listEl) {
        listEl.innerHTML = todos.map(renderTodoItem).join('');
    }
};

// ==========================================
// 4. Store & Bridge
// ==========================================
const STORAGE_KEY = 'my_functional_todos';
const getTodosFromDB = () => loadFromStorage(STORAGE_KEY, []);
const saveTodosToDB = saveToStorage(STORAGE_KEY);

const createStore = (initialState) => {
    let state = initialState;
    const listeners = [];

    return {
        getState: () => state,
        dispatch: (reducerFn) => {
            state = reducerFn(state);
            listeners.forEach(listener => listener(state));
        },
        subscribe: (listener) => {
            listeners.push(listener);
        }
    };
};

const store = createStore({
    todos: getTodosFromDB()
});

store.subscribe((state) => {
    saveTodosToDB(state.todos);
});

store.subscribe((state) => {
    render(state.todos);
});

// ==========================================
// 5. Event Listeners
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // رندر اولیه
    render(store.getState().todos);

    // فرم اضافه کردن
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value;

        if (!text.trim()) return;

        store.dispatch(state => ({
            ...state,
            todos: addTodo(state.todos, text)
        }));

        input.value = '';
    });

    // مدیریت حذف و انجام تودوها با Event Delegation دقیق
    const list = document.getElementById('todo-list');
    list?.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;

        const action = btn.dataset.action;
        const li = btn.closest('[data-id]');
        if (!li) return;

        const id = li.dataset.id;

        if (action === 'toggle') {
            store.dispatch(state => ({
                ...state,
                todos: toggleTodo(state.todos, id)
            }));
        }

        if (action === 'delete') {
            store.dispatch(state => ({
                ...state,
                todos: deleteTodo(state.todos, id)
            }));
        }
    });
});