// ==================== VARIABEL ====================
const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const errorMsg = document.getElementById('error-msg');

// State
let todos = [];
let currentFilter = 'all';

// ==================== EVENT LISTENERS ====================

// Tambah tugas saat klik tombol
addBtn.addEventListener('click', addTodo);

// Tambah tugas saat tekan Enter
todoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Hapus kelas active dari semua tombol
        document.querySelector('.filter-btn.active').classList.remove('active');
        // Tambahkan kelas active ke tombol yang diklik
        btn.classList.add('active');
        // Update filter
        currentFilter = btn.getAttribute('data-filter');
        // Render ulang daftar
        renderTodos();
    });
});

// ==================== FUNGSI-FUNGSI ====================

// Fungsi Menambah Tugas
function addTodo() {
    const text = todoInput.value.trim();
    const date = dateInput.value;

    // Validasi input
    if (text === '') {
        showError('⚠️ Silakan masukkan deskripsi tugas!');
        return;
    }

    // Validasi tanggal (tidak boleh kosong)
    if (date === '') {
        showError('⚠️ Silakan pilih tanggal!');
        return;
    }

    // Buat objek tugas baru
    const newTodo = {
        id: Date.now(),
        text: text,
        date: date,
        completed: false
    };

    // Tambahkan ke array
    todos.push(newTodo);

    // Reset input
    todoInput.value = '';
    dateInput.value = '';
    showError('');

    // Render ulang
    renderTodos();
}

// Fungsi Menghapus Tugas
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

// Fungsi Toggle Status (Selesai/Belum)
function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    renderTodos();
}

// Fungsi Merender Daftar Tugas
function renderTodos() {
    todoList.innerHTML = '';

    // Filter tugas
    let filteredTodos = todos;

    if (currentFilter === 'pending') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    // Tampilkan pesan jika tidak ada tugas
    if (filteredTodos.length === 0) {
        const emptyMsg = document.createElement('li');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = currentFilter === 'all' 
            ? '📭 Belum ada tugas. Tambahkan tugas baru!' 
            : currentFilter === 'pending' 
                ? '📭 Tidak ada tugas yang belum selesai.' 
                : '📭 Tidak ada tugas yang selesai.';
        todoList.appendChild(emptyMsg);
        return;
    }

    // Render setiap tugas
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        const dateDisplay = formatDate(todo.date);

        li.innerHTML = `
            <div class="todo-content" onclick="toggleComplete(${todo.id})">
                <span class="todo-text">${todo.text}</span>
                <span class="todo-date">📅 ${dateDisplay}</span>
            </div>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Hapus</button>
        `;

        todoList.appendChild(li);
    });
}

// Fungsi Menampilkan Pesan Error
function showError(message) {
    errorMsg.textContent = message;
}

// Fungsi Format Tanggal
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

// Render awal (kosong)
renderTodos();